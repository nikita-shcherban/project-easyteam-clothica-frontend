import { CategoriesPage } from '@/components/CategoriesPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Категорії товарів',
  description: 'Категорії товарів в магазині Clothica',
};
export default function Page() {
  return <CategoriesPage />;
}
