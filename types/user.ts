export interface User {
  _id: string;
  username: string;
  name?: string;
  surname?: string;
  phone: string;
  email?: string;
  city?: string;
  novaPoshtaBranch?: string;
  role: 'User' | 'Administrator';
  createdAt: string;
  updatedAt: string;
}
