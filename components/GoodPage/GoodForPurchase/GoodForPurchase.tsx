'use client';

import { useQuery } from '@tanstack/react-query';
import { getGoodById } from '@/lib/api/client-api';

interface GoodForPurchaseProps {
  goodId: string;
}

export default function GoodForPurchase({
  goodId,
}: GoodForPurchaseProps) {
  const {
    data: good,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['good', goodId],
    queryFn: () => getGoodById(goodId),
    enabled: Boolean(goodId),
  });

  if (isLoading) {
    return <p>Завантаження товару...</p>;
  }

  if (isError || !good) {
    return <p>Не вдалося завантажити товар.</p>;
  }

  return (
    <section>
      <div>
        {good.image && (
          <img
            src={good.image}
            alt={good.name}
            width={400}
          />
        )}
      </div>

      <div>
        <h1>{good.name}</h1>

        <p>
          {good.price.value} {good.price.currency}
        </p>

        <p>Категорія: {good.category.name}</p>

        <p>Рейтинг: {good.rating}</p>

        <p>Відгуків: {good.feedbacksCount}</p>

        <p>Розміри: {good.size.join(', ')}</p>

        {good.description && <p>{good.description}</p>}
      </div>
    </section>
  );
}