import type { Metadata } from 'next';
import GoodDetails from '@/components/GoodPage/GoodDetails';
import type { Good } from '@/types/goods';

type Props = { params: Promise<{ goodId: string }> };

async function getGood(goodId: string): Promise<Good | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/goods/${goodId}`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return null;
    const json: { data: Good } = await res.json();
    return json.data;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { goodId } = await params;
  const good = await getGood(goodId);

  if (!good) {
    return { title: 'Товар не знайдено' };
  }

  const text = good.prevDescription ?? good.description ?? '';
  const description = text.length > 160 ? `${text.slice(0, 157)}…` : text;

  return {
    title: good.name,
    description: description || `${good.name} в магазині Clothica`,
    openGraph: {
      title: good.name,
      description,
      images: good.image ? [{ url: good.image }] : undefined,
    },
  };
}

export default async function Page({ params }: Props) {
  const { goodId } = await params;
  return <GoodDetails goodId={goodId} />;
}
