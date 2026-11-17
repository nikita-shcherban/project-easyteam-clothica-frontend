import RegisterPage from '@/components/RegisterPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Реєстрація',
  description: 'Сторінка реєстрації нового користувача Clothica',
};

export default function Page() {
  return <RegisterPage />;
}
