'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useSyncExternalStore } from 'react';
import GoodsOrderList from '@/components/GoodsOrderList/GoodsOrderList';
import MessageNoInfo from '@/components/MessageNoInfo/MessageNoInfo';
import { useBasketStore } from '@/lib/store/basket-store';
import styles from './BasketModal.module.css';

export default function BasketModal() {
  const router = useRouter();
  const items = useBasketStore((s) => s.items);
  const removeItem = useBasketStore((s) => s.removeItem);
  const setQuantity = useBasketStore((s) => s.setQuantity);

  // persist читає localStorage лише в браузері — чекаємо, щоб не мигав «порожній кошик»
  const hydrated = useSyncExternalStore(
    (cb) => useBasketStore.persist.onFinishHydration(cb),
    () => useBasketStore.persist.hasHydrated(),
    () => false,
  );

  const close = () => router.back();
  // replace, а не push: щоб «Назад» у браузері не відкривав кошик знову
  const goTo = (href: string) => router.replace(href);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') router.back();
    };
    document.addEventListener('keydown', onKeyDown);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [router]);

  return (
    <div
      className={styles.backdrop}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="basket-title"
      >
        <button
          type="button"
          className={styles.close}
          onClick={close}
          aria-label="Закрити кошик"
        >
          <svg className={styles.closeIcon} aria-hidden="true">
            <use href="/icons/icons.svg#close" />
          </svg>
        </button>

        <h2 id="basket-title" className={styles.title}>
          Ваш кошик
        </h2>

        {hydrated && (
          <div className={styles.body}>
            {items.length > 0 ? (
              <>
                <GoodsOrderList
                  items={items}
                  onRemove={removeItem}
                  onQuantityChange={setQuantity}
                />
                <div className={styles.nav}>
                  <button
                    type="button"
                    className={styles.secondary}
                    onClick={() => goTo('/goods')}
                  >
                    Продовжити покупки
                  </button>
                  <button
                    type="button"
                    className={styles.primary}
                    onClick={() => goTo('/order')}
                  >
                    Оформити замовлення
                  </button>
                </div>
              </>
            ) : (
              <MessageNoInfo
                text="Ваш кошик порожній, мерщій до покупок!"
                buttonText="До покупок"
                onClick={() => goTo('/goods')}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
