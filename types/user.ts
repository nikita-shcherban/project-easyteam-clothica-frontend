export interface User {
  _id: string;
  username: string;
  phone: string;
  email?: string;
  role: 'User' | 'Administrator';
  createdAt: string;
  updatedAt: string;
}
