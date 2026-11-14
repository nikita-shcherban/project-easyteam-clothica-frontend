'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useGood } from '@/lib/hooks/useGood';
import styles from './GoodForPurchase.module.css';

interface GoodDetailsProps {
  goodId: string;
}

export default function GoodPage({ goodId }: GoodDetailsProps) {
  const { good, isLoading, isError } = useGood(goodId);

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  if (isLoading)
    return <div className={styles.stateMessage}>Завантаження товару...</div>;
  if (isError || !good)
    return <div className={styles.stateMessage}>Товар не знайдено</div>;

  // Встановлюємо перший доступний розмір за замовчуванням (наприклад, L або перший у масиві)
  const currentSize = selectedSize || good.size?.[0] || '';

  const handleAddToCart = () => {
    console.log('Додано в кошик:', {
      goodId: good._id,
      size: currentSize,
      quantity,
    });
    // Тут виклик твоєї функції/стору кошика
  };

  const handleBuyNow = () => {
    console.log('Купити зараз:', {
      goodId: good._id,
      size: currentSize,
      quantity,
    });
    // Тут редірект на оформлення замовлення /order
  };

  return (
    <main className={styles.container}>
      <div className={styles.grid}>
        {/* Ліва колонка: Зображення */}
        <div className={styles.imageWrapper}>
          {good.image ? (
            <img src={good.image} alt={good.name} className={styles.image} />
          ) : (
            <div className={styles.imagePlaceholder}>Немає фото</div>
          )}
        </div>

        {/* Права колонка: Інформація */}
        <div className={styles.info}>
          {/* Хлібні крихти */}
          <nav className={styles.breadcrumbs}>
            <Link href="/goods" className={styles.breadcrumbLink}>
              Всі товари
            </Link>
            <span className={styles.separator}>&gt;</span>
            <span className={styles.breadcrumbCurrent}>{good.name}</span>
          </nav>

          {/* Назва товару */}
          <h1 className={styles.title}>{good.name}</h1>

          {/* Ціна та рейтинг */}
          <div className={styles.priceRatingRow}>
            <span className={styles.price}>
              {good.price.value} {good.price.currency}
            </span>

            <span className={styles.divider}>|</span>

            <div className={styles.ratingBlock}>
              <span className={styles.stars}>
                {'★'.repeat(Math.round(good.rating || 0))}
                {'☆'.repeat(5 - Math.round(good.rating || 0))}
              </span>
              <span className={styles.ratingText}>
                ({good.rating.toFixed(1)}) • {good.feedbacksCount} відгуків
              </span>
            </div>
          </div>

          {/* Короткий опис */}
          {good.prevDescription && (
            <p className={styles.prevDescription}>{good.prevDescription}</p>
          )}

          {/* Вибір розміру */}
          {good.size && good.size.length > 0 && (
            <div className={styles.sizeGroup}>
              <label htmlFor="size-select" className={styles.label}>
                Розмір
              </label>
              <select
                id="size-select"
                value={currentSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className={styles.select}
              >
                {good.size.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Кнопки дій */}
          <div className={styles.actions}>
            <div className={styles.cartRow}>
              <button
                type="button"
                onClick={handleAddToCart}
                className={styles.addToCartBtn}
              >
                Додати в кошик
              </button>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, Number(e.target.value)))
                }
                className={styles.quantityInput}
                aria-label="Кількість"
              />
            </div>

            <button
              type="button"
              onClick={handleBuyNow}
              className={styles.buyNowBtn}
            >
              Купити зараз
            </button>

            <p className={styles.deliveryNote}>
              Безкоштовна доставка для замовлень від 1000 грн
            </p>
          </div>

          {/* Секція Опис та Характеристики */}
          <div className={styles.detailsSection}>
            <div className={styles.tabHeader}>
              <span className={styles.activeTab}>Опис</span>
            </div>

            {good.description && (
              <div className={styles.description}>
                {good.description.split('\n').map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            )}

            {good.characteristics && good.characteristics.length > 0 && (
              <div className={styles.characteristics}>
                <h3 className={styles.charTitle}>Основні характеристики</h3>
                <ul className={styles.charList}>
                  {good.characteristics.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
