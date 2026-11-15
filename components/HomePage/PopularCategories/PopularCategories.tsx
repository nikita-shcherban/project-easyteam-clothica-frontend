'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getCategories } from '@/lib/api/categories';
import { CategoryCard } from '@/components/CategoryCard';
import Loader from '@/components/Loader/Loader';
import styles from './PopularCategories.module.css';

export function PopularCategories() {
  const { data, isLoading } = useQuery({
    queryKey: ['categories', 'popular'],
    queryFn: () => getCategories({ page: 1, perPage: 3 }),
    staleTime: 5 * 60 * 1000,
  });

  return (
    <section id="popular-categories" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.header}>
            <h2 className={styles.title}>Популярні категорії</h2>
            <Link href="/categories" className={styles.allButton}>
              Всі категорії
            </Link>
          </div>

          {isLoading ? (
            <Loader />
          ) : (
            <ul className={styles.list}>
              {data?.categories.map((category) => (
                <li key={category._id} className={styles.item}>
                  <CategoryCard category={category} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

export default PopularCategories;
