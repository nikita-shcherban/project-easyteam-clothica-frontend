import ProfilePage from '@/components/ProfilePage/ProfilePage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Профіль',
  description: 'Сторінка користувача Clothica',
};
export default function Page() {
  return <ProfilePage />;
}
