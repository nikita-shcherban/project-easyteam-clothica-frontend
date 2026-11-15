'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import { Keyboard, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import MessageNoInfo from '@/components/MessageNoInfo/MessageNoInfo';
import type { Review } from '@/types/review';
import styles from './ReviewsList.module.css';

interface ReviewsListProps {
  reviews: Review[];
  title?: string;
}

const MAX_STARS = 5;

function Stars({ rating }: { rating: number }) {
  return (
    <div
      className={styles.stars}
      role="img"
      aria-label={`Оцінка ${rating} з ${MAX_STARS}`}
    >
      {Array.from({ length: MAX_STARS }, (_, i) => {
        const id =
          rating >= i + 1
            ? 'star-filled'
            : rating >= i + 0.5
              ? 'star-half'
              : 'star';
        return (
          <svg key={i} className={styles.star} aria-hidden="true">
            <use href={`/icons/icons.svg#${id}`} />
          </svg>
        );
      })}
    </div>
  );
}

export default function ReviewsList({ reviews, title }: ReviewsListProps) {
  const router = useRouter();
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [swiper, setSwiper] = useState<SwiperType | null>(null);

  if (!reviews.length) {
    return (
      <MessageNoInfo
        text="Поки що немає відгуків"
        buttonText="До товарів"
        onClick={() => router.push('/goods')}
      />
    );
  }

  const syncEdges = (s: SwiperType) => {
    setIsBeginning(s.isBeginning);
    setIsEnd(s.isEnd);
  };

  return (
    <div className={styles.wrapper}>
      {title && <h2 className={styles.title}>{title}</h2>}

      <Swiper
        className={styles.swiper}
        modules={[Navigation, Keyboard]}
        keyboard={{ enabled: true }}
        spaceBetween={32}
        slidesPerView={1}
        breakpoints={{
          768: { slidesPerView: 2 },
          1440: { slidesPerView: 3 },
        }}
        onSwiper={(s) => {
          setSwiper(s);
          syncEdges(s);
        }}
        onSlideChange={syncEdges}
        onResize={syncEdges}
        onBreakpoint={syncEdges}
      >
        {reviews.map((review) => (
          <SwiperSlide key={review._id} className={styles.slide}>
            <article className={styles.card}>
              <Stars rating={review.rating} />
              {review.text && (
                <p className={styles.text}>&quot;{review.text}&quot;</p>
              )}
              <div className={styles.meta}>
                <p className={styles.author} title={review.authorName}>
                  {review.authorName}
                </p>
                {review.goodName && (
                  <Link href={`/goods/${review.good}`} className={styles.good}>
                    {review.goodName}
                  </Link>
                )}
              </div>
            </article>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.arrow}
          onClick={() => swiper?.slidePrev()}
          disabled={isBeginning}
          aria-label="Попередній відгук"
        >
          <svg className={styles.arrowIcon} aria-hidden="true">
            <use href="/icons/icons.svg#arrow_back" />
          </svg>
        </button>
        <button
          type="button"
          className={styles.arrow}
          onClick={() => swiper?.slideNext()}
          disabled={isEnd}
          aria-label="Наступний відгук"
        >
          <svg className={styles.arrowIcon} aria-hidden="true">
            <use href="/icons/icons.svg#arrow_forward" />
          </svg>
        </button>
      </div>
    </div>
  );
}
