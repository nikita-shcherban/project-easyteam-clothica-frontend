import Link from 'next/link';
import type { ReactNode } from 'react';
import css from './AuthLayout.module.css';

type AuthLayoutProps = {
  children: ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className={css.main}>
      <header className={css.header}>
        <Link className={css.brand} href="/">
          Clothica
        </Link>
      </header>

      <div className={css.content}>{children}</div>

      <footer className={css.footer}>
        © 2025 Clothica. Всі права захищені.
      </footer>
    </main>
  );
}
