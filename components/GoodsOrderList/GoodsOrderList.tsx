'use client';

import type { BasketItem } from '@/types/basket';
import styles from './GoodsOrderList.module.css';

const FREE_DELIVERY_THRESHOLD = 1000;

const formatPrice = (value: number, currency: string) =>
  `${value.toLocaleString('uk-UA')} ${currency}`;

interface GoodsOrderListProps {
  items: BasketItem[];
  onRemove: (goodId: string, size: string) => void;
  /** Якщо передано — кількість можна змінювати, інакше лише показується */
  onQuantityChange?: (goodId: string, size: string, quantity: number) => void;
}

export default function GoodsOrderList({
  items,
  onRemove,
  onQuantityChange,
}: GoodsOrderListProps) {
  const currency = items[0]?.currency ?? 'грн';
  // Доставка в суму не входить: безкоштовна від порогу, інакше за тарифами перевізника
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <div className={styles.wrapper}>
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={`${item.goodId}-${item.size}`} className={styles.card}>
            {item.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.image}
                alt={item.name}
                loading="lazy"
                className={styles.image}
              />
            ) : (
              <div className={styles.image} />
            )}

            <div className={styles.content}>
              <div className={styles.header}>
                <h3
                  className={styles.name}
                  title={`${item.name}, розмір ${item.size}`}
                >
                  {item.name}
                </h3>
                <div className={styles.meta}>
                  <span
                    className={styles.metaItem}
                    aria-label={`Рейтинг ${item.rating}`}
                  >
                    <svg className={styles.metaIcon} aria-hidden="true">
                      <use href="/icons/icons.svg#star-filled" />
                    </svg>
                    {item.rating}
                  </span>
                  <span
                    className={styles.metaItem}
                    aria-label={`Відгуків: ${item.feedbacksCount}`}
                  >
                    <svg className={styles.metaIcon} aria-hidden="true">
                      <use href="/icons/icons.svg#comment" />
                    </svg>
                    {item.feedbacksCount}
                  </span>
                </div>
              </div>

              <p className={styles.price}>
                {formatPrice(item.price, item.currency)}
              </p>
            </div>

            <div className={styles.actions}>
              <input
                type="number"
                min={1}
                value={item.quantity}
                readOnly={!onQuantityChange}
                aria-label={`Кількість: ${item.name}`}
                className={styles.qty}
                onChange={(e) =>
                  onQuantityChange?.(
                    item.goodId,
                    item.size,
                    Math.max(1, Number(e.target.value) || 1),
                  )
                }
              />
              <button
                type="button"
                className={styles.remove}
                onClick={() => onRemove(item.goodId, item.size)}
                aria-label={`Видалити ${item.name} з кошика`}
              >
                <svg className={styles.removeIcon} aria-hidden="true">
                  <use href="/icons/icons.svg#delete" />
                </svg>
              </button>
            </div>
          </li>
        ))}
      </ul>

      <dl className={styles.summary}>
        <div className={`${styles.row} ${styles.subtotal}`}>
          <dt>Проміжний підсумок</dt>
          <dd className={styles.value}>{formatPrice(total, currency)}</dd>
        </div>
        <div className={`${styles.row} ${styles.delivery}`}>
          <dt>Доставка</dt>
          <dd>
            {total >= FREE_DELIVERY_THRESHOLD
              ? 'Безкоштовна доставка'
              : 'За тарифами перевізника'}
          </dd>
        </div>
        <div className={`${styles.row} ${styles.total}`}>
          <dt>Всього</dt>
          <dd className={styles.value}>{formatPrice(total, currency)}</dd>
        </div>
      </dl>
    </div>
  );
}
