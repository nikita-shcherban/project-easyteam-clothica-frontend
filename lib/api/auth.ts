import type { LoginValues } from '@/lib/validation/auth';
import type { User } from '@/types/user';
import { api } from './api';

export async function login(values: LoginValues): Promise<User> {
  const { data } = await api.post<User>('/auth/login', values);
  return data;
}
