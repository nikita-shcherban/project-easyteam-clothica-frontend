import Link from 'next/link';
import type { Good } from '@/types/goods';
import s from './GoodInfo.module.css';

export default function GoodInfo({ good }: { good: Good }) {
  return (
    <article className={s.card}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={s.img} src={good.image} alt={good.name} loading="lazy" />
      <div className={s.info}>
        <h3 className={s.name}>{good.name}</h3>
        <p className={s.price}>
          {good.price.value} {good.price.currency}
        </p>
        <p className={s.meta}>
          <span className={s.metaItem}>
            <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden>
              <path d="M12 2l3 7 7 .6-5.3 4.7 1.6 7.2L12 17.8l-6.3 3.7 1.6-7.2L2 9.6 9 9z" />
            </svg>
            {good.rating ?? 0}
          </span>
          <span className={s.metaItem}>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden
            >
              <path d="M4 4h16v13H8l-4 4zM8 9h8M8 13h8" />
            </svg>
            {good.feedbacksCount ?? 0}
          </span>
        </p>
      </div>
      <Link className={s.btn} href={`/goods/${good._id}`}>
        Детальніше
      </Link>
    </article>
  );
}
