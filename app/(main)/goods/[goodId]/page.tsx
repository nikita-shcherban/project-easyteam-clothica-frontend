'use client';

import GoodPage from '@/components/GoodPage/GoodForPurchase/GoodForPurchase';
import GoodReviews from '@/components/GoodPage/GoodReviews/GoodReviews';
import { useParams } from 'next/navigation';

export default function GoodDetails() {
  const params = useParams();
  const goodId = params.goodId as string;

  return (
    <main>
      <GoodPage goodId={goodId} />
      <GoodReviews goodId={goodId} />
    </main>
  );
}
