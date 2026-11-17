import type { ReactNode } from 'react';
import css from './AuthLayout.module.css';

type AuthLayoutProps = {
  children: ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className={css.main}>
      <div className={css.content}>{children}</div>

      <footer className={css.footer}>
        © 2025 Clothica. Всі права захищені.
      </footer>
    </div>
  );
}
