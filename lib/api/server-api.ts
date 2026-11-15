import 'server-only';
import axios from 'axios';
import { cookies } from 'next/headers';
import type { User } from '@/types/user';
import type { Order, UserOrdersResponse, OrderStatus } from '@/types/order';

const serverApi = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api`,
  timeout: 20_000,
});
const getCookieHeader = async (): Promise<string> => {
  const cookieStore = await cookies();
  return cookieStore.toString();
};
export const getMe = async (): Promise<User> => {
  const cookieHeader = await getCookieHeader();

  const response = await serverApi.get<User>('/users/me', {
    headers: {
      Cookie: cookieHeader,
    },
  });

  return response.data;
};

export const getUserOrdersServer = async (): Promise<UserOrdersResponse> => {
  const cookieHeader = await getCookieHeader();

  const response = await serverApi.get<UserOrdersResponse>('/orders', {
    headers: {
      Cookie: cookieHeader,
    },
  });

  return response.data;
};

export const updateUserServer = async (values: {
  name?: string;
  surname?: string;
  phone?: string;
  city?: string;
  novaPoshtaBranch?: string;
}): Promise<User> => {
  const cookieHeader = await getCookieHeader();

  const response = await serverApi.patch<{
    status: number;
    message: string;
    data: User;
  }>('/users/me', values, {
    headers: {
      Cookie: cookieHeader,
    },
  });

  return response.data.data;
};

export const updateOrderStatusServer = async (
  orderId: string,
  status: OrderStatus,
): Promise<Order> => {
  const cookieHeader = await getCookieHeader();

  const response = await serverApi.patch<{
    succes: boolean;
    message: string;
    data: Order;
  }>(
    `/orders/${orderId}/status`,
    { status },
    {
      headers: {
        Cookie: cookieHeader,
      },
    },
  );

  return response.data.data;
};
