'use client';
import { useCategories, useGoods } from '@/lib/hooks/useGoods';
import { useGoodsFilters } from '@/lib/hooks/useGoodsFilters';
import CategoriesFilter from './CategoriesFilter/CategoriesFilter';
import GoodsList from './GoodsList/GoodsList';
import Pagination from './Pagination/Pagination';
import s from './GoodsPage.module.css';

export default function GoodsPage() {
  const { filters, update, reset } = useGoodsFilters();
  const { data: categories = [] } = useCategories();
  const {
    goods,
    total,
    loading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useGoods(filters);

  const title = filters.category
    ? (categories.find((c) => c._id === filters.category)?.name ?? '')
    : 'Всі товари';

  return (
    <main className={s.page}>
      <h1 className={s.title}>{title}</h1>
      <div className={s.layout}>
        <CategoriesFilter
          filters={filters}
          categories={categories}
          shown={goods.length}
          total={total}
          onChange={update}
          onReset={reset}
        />
        <section>
          <GoodsList goods={goods} loading={loading} onReset={reset} />
          {hasNextPage && (
            <Pagination
              loading={isFetchingNextPage}
              onClick={() => fetchNextPage()}
            />
          )}
        </section>
      </div>
    </main>
  );
}
