'use client';

import { useQueries, useQuery } from '@tanstack/react-query';
import Loader from '@/components/Loader/Loader';
import ReviewsList from '@/components/ReviewsList/ReviewsList';
import { getGoodById, getReviews } from '@/lib/api/client-api';
import styles from './LastReviews.module.css';

export default function LastReviews() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['reviews', 'last'],
    queryFn: () => getReviews({ limit: 10 }),
  });

  const reviews = data?.data ?? [];

  // Бекенд не віддає назву товару у відгуку — підтягуємо товари окремо
  const goodIds = [...new Set(reviews.map((r) => r.good))];
  const goods = useQueries({
    queries: goodIds.map((id) => ({
      queryKey: ['good', id],
      queryFn: () => getGoodById(id),
      staleTime: 5 * 60 * 1000,
    })),
  });

  const goodNames = new Map(
    goods.flatMap((q) => (q.data ? [[q.data._id, q.data.name]] : [])),
  );

  const reviewsWithGoods = reviews.map((r) => ({
    ...r,
    goodName: r.goodName ?? goodNames.get(r.good),
  }));

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Останні відгуки</h2>

        {isLoading && <Loader />}
        {isError && <p>Не вдалося завантажити відгуки.</p>}
        {data && <ReviewsList reviews={reviewsWithGoods} />}
      </div>
    </section>
  );
}
