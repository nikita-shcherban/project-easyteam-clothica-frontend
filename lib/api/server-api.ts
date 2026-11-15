import 'server-only';

import axios from 'axios';
import { cookies } from 'next/headers';
import type { User } from '@/types/user';

export async function getUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken');
  const sessionId = cookieStore.get('sessionId');

  if (!accessToken?.value || !sessionId?.value) return null;

  const backendUrl =
    process.env.NEXT_PUBLIC_API_URL || process.env.API_BASE_URL;
  if (!backendUrl) throw new Error('Backend API URL is not configured');

  try {
    const response = await axios.get<User>(
      `${backendUrl.replace(/\/$/, '')}/api/users/me`,
      {
        headers: {
          Cookie: `${accessToken.name}=${encodeURIComponent(accessToken.value)}; ${sessionId.name}=${encodeURIComponent(sessionId.value)}`,
          'Cache-Control': 'no-store',
        },
        timeout: 15_000,
        maxRedirects: 0,
      },
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401)
      return null;
    throw error;
  }
}
