'use client';

import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';

import 'swiper/css';

import styles from './LastReviews.module.css';

const reviews = [
  {
    id: 1,
    rating: 5,
    text: 'Футболки Clothica - це справжня знахідка для мене! Я в захваті від якості та дизайну.',
    author: 'Олена Коваль',
    product: 'Базова футболка',
  },
  {
    id: 2,
    rating: 5,
    text: 'Я завжди отримую компліменти, коли ношу їх футболки! Вони стильні і зручні.',
    author: 'Ігор Петров',
    product: 'Худі з капюшоном',
  },
  {
    id: 3,
    rating: 5,
    text: 'Дуже приємні та якісні матеріали',
    author: 'Ігор Шевченко',
    product: 'Джинсові шорти',
  },
];

export default function LastReviews() {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.sectionTitle}>
          <h2 className={styles.title}>Останні відгуки</h2>
        </div>

        <Swiper
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          slidesPerView={3}
          spaceBetween={32}
          className={styles.reviewsSlider}
        >
          {reviews.map((review) => (
            <SwiperSlide key={review.id}>
              <article className={styles.reviewCard}>
                <div className={styles.stars}>
                  {Array.from({ length: review.rating }, (_, index) => (
                    <svg
                      key={index}
                      className={styles.star}
                      viewBox="0 0 20 19"
                      aria-hidden="true"
                    >
                      <path
                        d="M10 0L12.9 6.1L19.6 7.1L14.8 11.8L15.9 18.5L10 15.3L4.1 18.5L5.2 11.8L0.4 7.1L7.1 6.1L10 0Z"
                        fill="currentColor"
                      />
                    </svg>
                  ))}
                </div>

                <p className={styles.quote}>{review.text}</p>

                <div className={styles.avatarContent}>
                  <p className={styles.authorName}>{review.author}</p>

                  <p className={styles.productName}>{review.product}</p>
                </div>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className={styles.sliderDots}>
          <div className={styles.navigation}>
            <button
              type="button"
              className={styles.sliderArrow}
              aria-label="Попередні відгуки"
              onClick={() => swiperRef.current?.slidePrev()}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M19 12H5M5 12L12 19M5 12L12 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <button
              type="button"
              className={styles.sliderArrow}
              aria-label="Наступні відгуки"
              onClick={() => swiperRef.current?.slideNext()}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M5 12H19M19 12L12 5M19 12L12 19"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}