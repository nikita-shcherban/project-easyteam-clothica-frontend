import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const cookie = request.headers.get('cookie');

    if (!cookie) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/me`,
      {
        headers: {
          Cookie: cookie,
        },
        validateStatus: () => true,
      },
    );

    const data = response.data;

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch {
    return NextResponse.json(
      { message: 'Failed to fetch current user' },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const cookie = request.headers.get('cookie');

    if (!cookie) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const response = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/me`,
      body,
      {
        headers: {
          Cookie: cookie,
        },
        validateStatus: () => true,
      },
    );

    return NextResponse.json(response.data, {
      status: response.status,
    });
  } catch (error) {
    console.error('Failed to update current user:', error);
    return NextResponse.json(
      { message: 'Failed to update current user' },
      { status: 500 },
    );
  }
}
