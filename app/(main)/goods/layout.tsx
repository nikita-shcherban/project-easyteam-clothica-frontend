import type { ReactNode } from 'react';

interface GoodsLayoutProps {
  children: ReactNode;
}

export default function GoodsLayout({ children }: GoodsLayoutProps) {
  return <>{children}</>;
}
