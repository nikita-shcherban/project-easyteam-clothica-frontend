'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { getCategories } from '@/lib/api/categories';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import { CategoryCard } from '@/components/CategoryCard';
import Loader from '@/components/Loader/Loader';
import styles from './CategoriesList.module.css';

export function CategoriesList() {
  const isDesktop = useMediaQuery('(min-width: 1440px)');
  const step = isDesktop ? 3 : 2;

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: ['categories', 'list', step],
      queryFn: ({ pageParam }) =>
        pageParam === 1
          ? getCategories({ page: 1, perPage: step * 2 })
          : getCategories({ page: pageParam, perPage: step }),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        const loaded = allPages.reduce(
          (sum, page) => sum + page.categories.length,
          0,
        );
        return loaded < lastPage.totalCategories
          ? loaded / step + 1
          : undefined;
      },
    });

  const categories = data?.pages.flatMap((page) => page.categories) ?? [];
  const isBusy = isLoading || isFetchingNextPage;

  return (
    <>
      <ul className={styles.categoriesList}>
        {categories.map((category) => (
          <li key={category._id} className={styles.categoriesItem}>
            <CategoryCard category={category} />
          </li>
        ))}
      </ul>

      {isBusy && <Loader />}

      {hasNextPage && !isBusy && (
        <button
          type="button"
          className={styles.loadMoreButton}
          onClick={() => fetchNextPage()}
        >
          Показати більше
        </button>
      )}
    </>
  );
}

export default CategoriesList;
