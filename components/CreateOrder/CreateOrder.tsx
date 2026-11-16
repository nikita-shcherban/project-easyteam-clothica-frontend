'use client';

import GoodsOrderList from '@/components/GoodsOrderList/GoodsOrderList';
import { useBasketStore } from '@/lib/store/basket-store';
import Link from 'next/link';
import { useEffect } from 'react';
import CreateOrderForm from './CreateOrderForm/CreateOrderForm';
import styles from './CreateOrder.module.css';

export default function CreateOrder() {
  const items = useBasketStore((s) => s.items);
  const removeItem = useBasketStore((s) => s.removeItem);
  const setQuantity = useBasketStore((s) => s.setQuantity);

  // стор створено з skipHydration: підтягуємо кошик з localStorage вручну
  useEffect(() => {
    useBasketStore.persist.rehydrate();
  }, []);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h1 className={styles.title}>Оформити замовлення</h1>

        {items.length === 0 ? (
          <p className={styles.empty}>
            Кошик порожній. <Link href="/goods">Перейти до товарів</Link>
          </p>
        ) : (
          <div className={styles.columns}>
            <div>
              <h2 className={styles.subtitle}>Товари</h2>
              <GoodsOrderList
                items={items}
                onRemove={removeItem}
                onQuantityChange={setQuantity}
              />
            </div>

            <CreateOrderForm />
          </div>
        )}
      </div>
    </section>
  );
}
