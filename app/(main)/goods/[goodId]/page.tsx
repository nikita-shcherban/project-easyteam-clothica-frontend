import GoodForPurchase from '@/components/GoodPage/GoodForPurchase/GoodForPurchase';

interface PageProps {
  params: Promise<{
    goodId: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { goodId } = await params;

  return <GoodForPurchase goodId={goodId} />;
}