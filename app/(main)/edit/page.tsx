import type { Metadata } from 'next';
import PersonalPage from '@/components/PersonalPage/PersonalPage';

export const metadata: Metadata = {
  title: 'Редагування даних покупця | Clothica',
  description: 'Сторінка оновлення персональних даних користувача Clothica',
};

export default function EditProfilePage() {
  return <PersonalPage />;
}
