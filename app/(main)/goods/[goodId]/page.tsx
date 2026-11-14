'use client';

import GoodPage from '@/components/GoodPage/GoodForPurchase/GoodForPurchase';
import { useParams } from 'next/navigation';

export default function GoodDetails() {
  const params = useParams();
  const goodId = params.goodId as string;

  return (
    <main>
      <GoodPage goodId={goodId} />
    </main>
  );
}
