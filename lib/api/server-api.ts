import axios from 'axios';

export interface RegisterUserData {
  username: string;
  phone: string;
  password: string;
}

export const registerUser = async (user: RegisterUserData): Promise<void> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

  await axios.post(`${apiUrl}/api/auth/register`, user);
};
