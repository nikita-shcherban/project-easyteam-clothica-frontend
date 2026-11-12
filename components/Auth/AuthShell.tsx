import type { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from '@/components/LoginPage/LoginPage.module.css';

interface AuthShellProps {
  children: ReactNode;
}

export default function AuthShell({ children }: AuthShellProps) {
  return (
    <div className={styles.page} lang="uk">
      <header className={styles.header}>
        <Link href="/" className={styles.logo} aria-label="Clothica — головна">
          <Image
            src="/clothica-logo.svg"
            alt="Clothica"
            width={80.3348}
            height={16.9201}
            priority
          />
        </Link>
      </header>
      <main className={styles.main}>
        <section className={styles.content} aria-labelledby="auth-title">
          <nav className={styles.tabs} aria-label="Авторизація">
            <Link href="/auth/register">Реєстрація</Link>
            <Link href="/auth/login" aria-current="page">
              Вхід
            </Link>
          </nav>
          <h1 id="auth-title" className={styles.title}>
            Вхід
          </h1>
          {children}
        </section>
      </main>
      <footer className={styles.footer}>
        <p>© 2025 Clothica. Всі права захищені.</p>
      </footer>
    </div>
  );
}
