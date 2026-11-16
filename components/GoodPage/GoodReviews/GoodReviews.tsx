'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { getReviews } from '@/lib/api/client-api';
import { useAuthStore } from '@/lib/store/auth-store';
import MessageNoInfo from './MessageNoInfo/MessageNoInfo';
import ReviewFormModal from './ReviewFormModal/ReviewFormModal';
import ReviewsList from './ReviewsList/ReviewsList';
import css from './GoodReviews.module.css';
import Loader from '@/components/Loader/Loader';

const REVIEWS_LIMIT = 10;

interface Props {
  goodId?: string;
  title?: string;
}

export default function GoodReviews({
  goodId,
  title = 'Відгуки клієнтів',
}: Props) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = Boolean(user);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['reviews', goodId ?? 'all'],
    queryFn: () => getReviews({ limit: REVIEWS_LIMIT, goodId }),
  });

  const reviews = data?.data ?? [];
  const openForm = () => setIsFormOpen(true);

  return (
    <section className={css.section}>
      <div className={css.container}>
        <div className={css.header}>
          <h2 className={css.title}>{title}</h2>
          {reviews.length > 0 && (
            <button type="button" className={css.btn} onClick={openForm}>
              Залишити відгук
            </button>
          )}
        </div>

        {isLoading && <Loader size="md" />}
        {isError && (
          <p className={css.status}>Не вдалося завантажити відгуки.</p>
        )}

        {!isLoading && !isError && reviews.length === 0 && (
          <div className={css.empty}>
            <MessageNoInfo
              text={
                goodId
                  ? 'У цього товару ще немає відгуків'
                  : 'Поки що немає відгуків'
              }
              buttonText="Залишити відгук"
              onClick={openForm}
            />
          </div>
        )}

        {reviews.length > 0 && (
          <ReviewsList reviews={reviews} showGoodLink={!goodId} />
        )}
      </div>

      {isFormOpen && (
        <ReviewFormModal
          goodId={goodId}
          defaultName={user?.username || ''}
          isAuthenticated={isAuthenticated}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </section>
  );
}
