import { Suspense } from 'react';
import GoodsPage from '@/components/GoodsPage/GoodsPage';

// Suspense потрібен, бо useSearchParams у клієнтському компоненті
export default function Page() {
  return (
    <Suspense>
      <GoodsPage />
    </Suspense>
  );
}
