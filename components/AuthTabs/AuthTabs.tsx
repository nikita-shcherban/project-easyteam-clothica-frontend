import Link from 'next/link';
import css from './AuthTabs.module.css';

type AuthTabsProps = {
  activeTab: 'register' | 'login';
};

function AuthTabs({ activeTab }: AuthTabsProps) {
  return (
    <nav className={css.tabs} aria-label="Обліковий запис">
      <Link
        className={activeTab === 'register' ? css.activeTab : css.tab}
        href="/auth/register"
        aria-current={activeTab === 'register' ? 'page' : undefined}
      >
        Реєстрація
      </Link>
      <Link
        className={activeTab === 'login' ? css.activeTab : css.tab}
        href="/auth/login"
        aria-current={activeTab === 'login' ? 'page' : undefined}
      >
        Вхід
      </Link>
    </nav>
  );
}

export default AuthTabs;
