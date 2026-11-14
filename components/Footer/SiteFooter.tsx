'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

/** Сторінки авторизації мають власний короткий футер (за макетом) */
export default function SiteFooter({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith('/auth')) return null;
  return <>{children}</>;
}
