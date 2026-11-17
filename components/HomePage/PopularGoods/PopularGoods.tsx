'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { Keyboard } from 'swiper/modules';

import 'swiper/css';

import { useGoods } from '@/lib/hooks/useGoods';
import type { Good } from '@/types/goods';

import styles from './PopularGoods.module.css';

const MAX_GOODS = 12;

function ArrowIcon({ direction }: { direction: 'prev' | 'next' }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      {direction === 'prev' ? (
        <path
          d="M19 12H5M5 12L12 19M5 12L12 5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M5 12H19M19 12L12 5M19 12L12 19"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

function ProductCard({ good }: { good: Good }) {
  return (
    <article className={styles.card}>
      <Link
        href={`/goods/${good._id}`}
        className={styles.cardLink}
        aria-label={`Переглянути товар ${good.name}`}
      >
        <div className={styles.imageWrapper}>
          {good.image ? (
            <img
              className={styles.image}
              src={good.image}
              alt={good.name}
              loading="lazy"
            />
          ) : (
            <div className={styles.imagePlaceholder} />
          )}
        </div>

        <div className={styles.contentBottom}>
          <div className={styles.productInfo}>
            <div className={styles.productHeader}>
              <h3 className={styles.productTitle}>{good.name}</h3>

              <div className={styles.meta}>
                <span aria-label={`Рейтинг ${good.rating ?? 0}`}>
                  ★ {good.rating ?? 0}
                </span>

                <span aria-label={`${good.feedbacksCount ?? 0} відгуків`}>
                  💬 {good.feedbacksCount ?? 0}
                </span>
              </div>
            </div>

            <p className={styles.price}>
              {good.price.value} {good.price.currency}
            </p>
          </div>

          <span className={styles.detailsButton}>Детальніше</span>
        </div>
      </Link>
    </article>
  );
}

export default function PopularGoods() {
  const {
    goods,
    loading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGoods({
    sizes: [],
  });

  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  // Захист від повторних запитів
  const isLoadingMoreRef = useRef(false);

  // Сортуємо завантажені товари за рейтингом і обмежуємо їх кількість до 12
  const popularGoods = [...goods]
    .slice(0, MAX_GOODS)
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));

  // Оновлюємо стан слайдера
  const updateSwiperState = (instance: SwiperType) => {
    if (instance.destroyed) return;

    setActiveIndex(instance.activeIndex);
    setIsBeginning(instance.isBeginning);
    setIsEnd(instance.isEnd);
  };

  useEffect(() => {
    if (
      !swiper ||
      swiper.destroyed ||
      !hasNextPage ||
      goods.length >= MAX_GOODS ||
      isFetchingNextPage ||
      isLoadingMoreRef.current
    ) {
      return;
    }

    const visibleSlides = swiper.slidesPerViewDynamic();
    const lastVisibleIndex = swiper.activeIndex + visibleSlides;

    if (goods.length - lastVisibleIndex <= 1) {
      isLoadingMoreRef.current = true;

      void fetchNextPage().finally(() => {
        isLoadingMoreRef.current = false;
      });
    }
  }, [
    swiper,
    activeIndex,
    goods.length,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  ]);

  useEffect(() => {
    if (!swiper || swiper.destroyed) return;

    swiper.update();
    updateSwiperState(swiper);
  }, [swiper, popularGoods.length]);

  const getMaxIndex = () => {
    if (!swiper || swiper.destroyed) return 0;

    const visibleSlides = swiper.slidesPerViewDynamic();

    return Math.max(0, swiper.slides.length - visibleSlides);
  };

  const goToSlide = (index: number) => {
    swiper?.slideTo(index);
  };

  const goPrev = () => {
    swiper?.slidePrev();
  };

  const goNext = () => {
    swiper?.slideNext();
  };

  const maxIndex = getMaxIndex();

  const activeDot =
    maxIndex > 0
      ? Math.round((activeIndex / maxIndex) * 4)
      : 0;

  const isInitialLoading = loading && goods.length === 0;

  const isPrevDisabled = isBeginning;

  const isNextDisabled =
    isEnd &&
    (!hasNextPage || goods.length >= MAX_GOODS) &&
    !isFetchingNextPage;

  return (
    <section id="popular-goods" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Популярні товари</h2>

          <Link href="/goods" className={styles.allGoodsLink}>
            Всі товари
          </Link>
        </div>

        {isInitialLoading && <Loader />}

        {error && <p>Не вдалося завантажити товари.</p>}

        {!isInitialLoading &&
          !error &&
          popularGoods.length === 0 && (
            <p>Товари поки що відсутні.</p>
          )}

        {!isInitialLoading &&
          !error &&
          popularGoods.length > 0 && (
            <div className={styles.content}>
              <div className={styles.sliderWrapper}>
                <Swiper
                  modules={[Keyboard]}
                  keyboard={{
                    enabled: true,
                    onlyInViewport: true,
                  }}
                  onSwiper={(instance) => {
                    setSwiper(instance);
                    updateSwiperState(instance);
                  }}
                  onSlideChange={updateSwiperState}
                  onBreakpoint={updateSwiperState}
                  onResize={updateSwiperState}
                  onUpdate={updateSwiperState}
                  slidesPerView={1}
                  spaceBetween={32}
                  breakpoints={{
                    768: {
                      slidesPerView: 2,
                    },
                    1440: {
                      slidesPerView: 4,
                    },
                  }}
                >
                  {popularGoods.map((good) => (
                    <SwiperSlide key={good._id}>
                      <ProductCard good={good} />
                    </SwiperSlide>
                  ))}
                </Swiper>

                {/* Стрілки біля зображень */}
                <button
                  type="button"
                  className={`${styles.sliderArrow} ${styles.imageArrow} ${styles.imageArrowPrev}`}
                  aria-label="Попередні товари"
                  onClick={goPrev}
                  disabled={isPrevDisabled}
                >
                  <ArrowIcon direction="prev" />
                </button>

                <button
                  type="button"
                  className={`${styles.sliderArrow} ${styles.imageArrow} ${styles.imageArrowNext}`}
                  aria-label="Наступні товари"
                  onClick={goNext}
                  disabled={isNextDisabled}
                >
                  <ArrowIcon direction="next" />
                </button>
              </div>

              <div className={styles.controls}>
                {/* Індикатори слайдера */}
                <div className={styles.sliderDots}>
                  {Array.from({ length: 5 }, (_, index) => {
                    const targetIndex = Math.round(
                      (index / 4) * maxIndex,
                    );

                    const isActive = index === activeDot;

                    const isNeighbor =
                      Math.abs(index - activeDot) === 1;

                    return (
                      <button
                        key={index}
                        type="button"
                        aria-label={`Перейти до позиції ${index + 1}`}
                        aria-current={isActive ? 'true' : undefined}
                        className={`${styles.dot} ${
                          isActive
                            ? styles.dotActive
                            : isNeighbor
                              ? styles.dotMedium
                              : ''
                        }`}
                        onClick={() => goToSlide(targetIndex)}
                      />
                    );
                  })}
                </div>

                {/* Мобільні стрілки */}
                <div className={styles.arrows}>
                  <button
                    type="button"
                    className={styles.sliderArrow}
                    aria-label="Попередні товари"
                    onClick={goPrev}
                    disabled={isPrevDisabled}
                  >
                    <ArrowIcon direction="prev" />
                  </button>

                  <button
                    type="button"
                    className={styles.sliderArrow}
                    aria-label="Наступні товари"
                    onClick={goNext}
                    disabled={isNextDisabled}
                  >
                    <ArrowIcon direction="next" />
                  </button>
                </div>
              </div>

              {isFetchingNextPage && <Loader />}
            </div>
          )}
      </div>
    </section>
  );
}
