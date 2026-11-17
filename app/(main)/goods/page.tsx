import { Suspense } from 'react';
import GoodsPage from '@/components/GoodsPage/GoodsPage';
import type { Metadata } from 'next';
import axios from 'axios';
import type { Category } from '@/types/goods';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

async function getCategoryName(id: string): Promise<string | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/categories?perPage=20`,
      { next: { revalidate: 3600 } }, // список категорий почти не меняется
    );
    if (!res.ok) return null;
    const data: { categories: Category[] } = await res.json();
    return data.categories.find((c) => c._id === id)?.name ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const { category } = await searchParams;
  const id = Array.isArray(category) ? category[0] : category;
  const name = id ? await getCategoryName(id) : null;

  if (!name) {
    return {
      title: 'Усі товари',
      description: 'Товари, які можна купити в магазині Clothica',
    };
  }
  return {
    title: name,
    description: `Товари в категорії ${name} в магазині Clothica`,
  };
}
// Suspense потрібен, бо useSearchParams у клієнтському компоненті
export default function Page() {
  return (
    <Suspense>
      <GoodsPage />
    </Suspense>
  );
}
