import GoodForPurchase from '@/components/GoodPage/GoodForPurchase/GoodForPurchase';
import GoodReviews from '@/components/GoodPage/GoodReviews/GoodReviews';

interface PageProps {
  params: Promise<{
    goodId: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { goodId } = await params;

  return (
    <main>
      <GoodForPurchase goodId={goodId} />
      <GoodReviews goodId={goodId} />
    </main>
  );
}