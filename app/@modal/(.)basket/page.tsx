import BasketModal from '@/components/BasketModal/BasketModal';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Кошик покупця',
  description: 'Обрані товари до покупки в магазині Clothica',
};
// Перехоплений маршрут /basket: перехід зі сторінки сайту відкриває кошик модалкою
export default function BasketModalPage() {
  return <BasketModal />;
}
