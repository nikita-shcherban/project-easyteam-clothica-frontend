'use client';

import GoodPage from '@/components/GoodPage/GoodForPurchase/GoodForPurchase';
import GoodReviews from '@/components/GoodPage/GoodReviews/GoodReviews';

interface Props {
  goodId: string;
}

export default function GoodDetails({ goodId }: Props) {
  return (
    <main>
      <GoodPage goodId={goodId} />
      <GoodReviews goodId={goodId} />
    </main>
  );
}
