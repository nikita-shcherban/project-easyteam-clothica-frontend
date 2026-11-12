import { api } from '@/lib/api/api';

export interface RegisterUserData {
  username: string;
  phone: string;
  password: string;
}

export const registerUser = async (user: RegisterUserData): Promise<void> => {
  await api.post('/auth/register', user);
};
