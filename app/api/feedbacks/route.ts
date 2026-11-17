import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://project-easyteam-2.onrender.com';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams.toString();
    const targetUrl = `${BACKEND_URL}/api/feedbacks${
      searchParams ? `?${searchParams}` : ''
    }`;

    const response = await axios.get(targetUrl, {
      validateStatus: () => true,
    });

    return NextResponse.json(response.data, {
      status: response.status,
    });
  } catch (error) {
    console.error('Failed to fetch feedbacks via route handler:', error);
    return NextResponse.json(
      { message: 'Failed to fetch feedbacks' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookie = request.headers.get('cookie') || '';
    const body = await request.json();

    const response = await axios.post(`${BACKEND_URL}/api/feedbacks`, body, {
      headers: {
        ...(cookie ? { Cookie: cookie } : {}),
      },
      validateStatus: () => true,
    });

    return NextResponse.json(response.data, {
      status: response.status,
    });
  } catch (error) {
    console.error('Failed to create feedback via route handler:', error);
    return NextResponse.json(
      { message: 'Failed to create feedback' },
      { status: 500 },
    );
  }
}
