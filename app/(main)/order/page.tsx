import CreateOrder from '@/components/CreateOrder/CreateOrder';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Оформлення замовлення',
  description: 'Оформлення замовлення в магазині Clothica',
};
export default function OrderPage() {
  return <CreateOrder />;
}
