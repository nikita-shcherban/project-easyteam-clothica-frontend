import { NextRequest, NextResponse } from 'next/server';
import { ValidationError } from 'yup';
import { loginSchema } from '@/lib/validation/auth';

const sessionCookies = ['accessToken', 'refreshToken', 'sessionId'] as const;

function errorResponse(message: string, status: number) {
  return NextResponse.json(
    { message },
    {
      status,
      headers: { 'Cache-Control': 'no-store' },
    },
  );
}

export async function POST(request: NextRequest) {
  // Login CSRF matters even before a user has a session.
  const origin = request.headers.get('origin');
  // NextURL normalizes 127.0.0.1 to localhost; the browser's Host stays exact.
  const expectedOrigin = `${request.nextUrl.protocol}//${request.headers.get('host')}`;
  if (
    (origin && origin !== expectedOrigin) ||
    request.headers.get('sec-fetch-site') === 'cross-site'
  ) {
    return errorResponse('Forbidden origin', 403);
  }
  if (!request.headers.get('content-type')?.includes('application/json')) {
    return errorResponse('Expected application/json', 415);
  }

  const backendUrl = process.env.API_BASE_URL;
  if (!backendUrl)
    return errorResponse('Authentication is not configured', 503);

  let values;
  try {
    const body: unknown = await request.json();
    values = await loginSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });
  } catch (error) {
    if (error instanceof ValidationError || error instanceof SyntaxError) {
      return errorResponse('Invalid request body', 400);
    }
    return errorResponse('Invalid request', 400);
  }

  try {
    const upstream = await fetch(new URL('/api/auth/login', backendUrl), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(values),
      cache: 'no-store',
      redirect: 'error',
      signal: AbortSignal.timeout(15_000),
    });

    if (!upstream.ok) {
      // Never reflect HTML, stack traces or raw backend messages into a toast.
      const status = [400, 401, 403, 422, 429].includes(upstream.status)
        ? upstream.status
        : 502;
      return errorResponse('Authentication failed', status);
    }

    const user: unknown = await upstream.json();
    if (
      !user ||
      typeof user !== 'object' ||
      !('_id' in user) ||
      typeof user._id !== 'string' ||
      !('username' in user) ||
      typeof user.username !== 'string' ||
      !('phone' in user) ||
      typeof user.phone !== 'string' ||
      !('role' in user) ||
      !['User', 'Administrator'].includes(String(user.role))
    ) {
      return errorResponse('Invalid authentication response', 502);
    }

    const cookieHeaders = new Headers();
    for (const cookie of upstream.headers.getSetCookie()) {
      cookieHeaders.append('set-cookie', cookie);
    }
    const parsedCookies = new NextResponse(null, { headers: cookieHeaders })
      .cookies;
    if (sessionCookies.some((name) => !parsedCookies.get(name)?.value)) {
      return errorResponse('Missing session cookies', 502);
    }

    // Explicitly allow only public user fields in the browser response.
    const response = NextResponse.json(
      {
        _id: user._id,
        username: user.username,
        phone: user.phone,
        role: user.role,
        ...('email' in user && typeof user.email === 'string'
          ? { email: user.email }
          : {}),
        ...('createdAt' in user ? { createdAt: user.createdAt } : {}),
        ...('updatedAt' in user ? { updatedAt: user.updatedAt } : {}),
      },
      { status: upstream.status, headers: { 'Cache-Control': 'no-store' } },
    );

    for (const name of sessionCookies) {
      const cookie = parsedCookies.get(name)!;
      response.cookies.set(name, cookie.value, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        ...(cookie.maxAge !== undefined ? { maxAge: cookie.maxAge } : {}),
        ...(cookie.expires ? { expires: cookie.expires } : {}),
      });
    }
    return response;
  } catch (error) {
    const timedOut = error instanceof Error && error.name === 'TimeoutError';
    return errorResponse(
      'Authentication service unavailable',
      timedOut ? 504 : 502,
    );
  }
}
