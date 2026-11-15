'use client';

import type { BasketItem } from '@/types/basket';
import styles from './GoodsOrderList.module.css';

// Доставка за тарифами перевізника — поки 0
const DELIVERY_PRICE = 0;

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
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const total = subtotal + DELIVERY_PRICE;

  return (
    <div className={styles.wrapper}>
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={`${item.goodId}-${item.size}`} className={styles.item}>
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

            <div className={styles.info}>
              <h3 className={styles.name}>{item.name}</h3>

              <p className={styles.meta}>
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
                  <svg
                    className={styles.metaIconOutline}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path d="M4 4h16v13H8l-4 4zM8 9h8M8 13h8" />
                  </svg>
                  {item.feedbacksCount}
                </span>
              </p>

              <p className={styles.size}>Розмір: {item.size}</p>
            </div>

            <div className={styles.side}>
              <p className={styles.price}>
                {item.price} {item.currency}
              </p>

              <div className={styles.controls}>
                {onQuantityChange ? (
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    aria-label={`Кількість: ${item.name}`}
                    className={styles.qty}
                    onChange={(e) =>
                      onQuantityChange(
                        item.goodId,
                        item.size,
                        Math.max(1, Number(e.target.value) || 1),
                      )
                    }
                  />
                ) : (
                  <span className={styles.qty}>{item.quantity}</span>
                )}

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
            </div>
          </li>
        ))}
      </ul>

      <dl className={styles.summary}>
        <div className={styles.row}>
          <dt>Проміжний підсумок</dt>
          <dd>
            {subtotal} {currency}
          </dd>
        </div>
        <div className={styles.row}>
          <dt>Доставка</dt>
          <dd>
            {DELIVERY_PRICE} {currency}
          </dd>
        </div>
        <div className={`${styles.row} ${styles.total}`}>
          <dt>Всього</dt>
          <dd>
            {total} {currency}
          </dd>
        </div>
      </dl>
    </div>
  );
}
