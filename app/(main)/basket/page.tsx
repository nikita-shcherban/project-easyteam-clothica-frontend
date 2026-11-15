import { redirect } from 'next/navigation';

// Пряме відкриття /basket (оновлення сторінки або збережене посилання) → оформлення замовлення
export default function BasketPage() {
  redirect('/order');
}
