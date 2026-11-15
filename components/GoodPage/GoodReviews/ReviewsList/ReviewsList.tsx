'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import { Keyboard } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

import type { Review } from '@/types/review';
import StarRating from '../StarRating/StarRating';
import styles from './ReviewsList.module.css';

interface ReviewsListProps {
  reviews: Review[];
  showGoodLink?: boolean;
}

export default function ReviewsList({
  reviews,
  showGoodLink = false,
}: ReviewsListProps) {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const syncEdges = (s: SwiperType) => {
    setIsBeginning(s.isBeginning);
    setIsEnd(s.isEnd);
  };

  return (
    <div className={styles.wrapper}>
      <Swiper
        modules={[Keyboard]}
        keyboard={{ enabled: true }}
        spaceBetween={24}
        slidesPerView={1}
        breakpoints={{
          768: { slidesPerView: 2, spaceBetween: 24 },
          1440: { slidesPerView: 3, spaceBetween: 32 },
        }}
        onSwiper={(s) => {
          setSwiper(s);
          syncEdges(s);
        }}
        onSlideChange={syncEdges}
        onResize={syncEdges}
        onBreakpoint={syncEdges}
        onUpdate={syncEdges}
      >
        {reviews.map((review) => (
          <SwiperSlide key={review._id} className={styles.slide}>
            <article className={styles.card}>
              <StarRating value={review.rating} />
              {review.text && (
                <p className={styles.text}>&quot;{review.text}&quot;</p>
              )}
              <div className={styles.meta}>
                <p className={styles.author} title={review.authorName}>
                  {review.authorName}
                </p>
                {showGoodLink && review.goodName && (
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
          <svg
            className={styles.arrowIcon}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              d="M15 18l-6-6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          type="button"
          className={styles.arrow}
          onClick={() => swiper?.slideNext()}
          disabled={isEnd}
          aria-label="Наступний відгук"
        >
          <svg
            className={styles.arrowIcon}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              d="M9 18l6-6-6-6"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
