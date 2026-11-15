'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import { api } from '@/lib/api/api';
import { useAuthStore } from '@/lib/store/auth-store';
import { useBasketStore } from '@/lib/store/basket-store';
import type { User } from '@/types/user';
import css from './Header.module.css';

const links = [
  { href: '/', label: 'Головна' },
  { href: '/goods', label: 'Товари' },
  { href: '/categories', label: 'Категорії' },
];

function Icon({ name }: { name: 'menu' | 'close' | 'shopping-cart' }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      {name === 'close' ? (
        <path
          d="m6 6 12 12M18 6 6 18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      ) : (
        <use href={`/icons/icons.svg#${name}`} />
      )}
    </svg>
  );
}

export default function HeaderClient({
  initialUser,
}: {
  initialUser: User | null;
}) {
  const pathname = usePathname();
  const router = useRouter();
  // SSR/hydration use the server result; subsequent updates use the team's store.
  const user = useSyncExternalStore(
    useAuthStore.subscribe,
    () => useAuthStore.getState().user,
    () => initialUser,
  );
  const setUser = useAuthStore((state) => state.setUser);
  const count = useBasketStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0),
  );
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const menuOpen = menuPath === pathname;
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState('');
  const dialogRef = useRef<HTMLDialogElement>(null);

  useLayoutEffect(() => {
    setUser(initialUser);
  }, [initialUser, setUser]);

  useEffect(() => {
    void useBasketStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const dialog = dialogRef.current;
    if (!dialog) return;

    dialog.showModal();
    const scrollY = window.scrollY;
    const previous = {
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
      overflow: document.documentElement.style.overflow,
    };
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.documentElement.style.overflow = 'hidden';

    const tablet = window.matchMedia('(min-width: 768px)');
    const closeOnResize = () => {
      if (tablet.matches) setMenuPath(null);
    };
    tablet.addEventListener('change', closeOnResize);
    closeOnResize();

    return () => {
      tablet.removeEventListener('change', closeOnResize);
      dialog.close();
      document.body.style.position = previous.position;
      document.body.style.top = previous.top;
      document.body.style.width = previous.width;
      document.documentElement.style.overflow = previous.overflow;
      window.scrollTo({ top: scrollY, behavior: 'instant' });
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuPath(null);

  async function logout() {
    if (loggingOut) return;
    setLoggingOut(true);
    setError('');
    try {
      await api.post('/auth/logout');
      setUser(null);
      closeMenu();
      router.replace('/');
      router.refresh();
    } catch {
      setError('Не вдалося вийти. Спробуйте ще раз.');
    } finally {
      setLoggingOut(false);
    }
  }

  function brand() {
    return (
      <Link
        href="/"
        className={css.brand}
        aria-label="Clothica — головна"
        onClick={closeMenu}
      >
        <Image
          src="/clothica-logo.svg"
          alt="Clothica"
          width={81}
          height={17}
          priority
        />
      </Link>
    );
  }

  function cart() {
    return (
      <Link
        href="/basket"
        scroll={false}
        className={css.cart}
        onClick={closeMenu}
        aria-label={`Кошик: ${count}. Відкрити кошик`}
      >
        <Icon name="shopping-cart" />
        {count > 0 && (
          <span className={css.badge} aria-hidden="true">
            {count > 99 ? '99+' : count}
          </span>
        )}
        <span
          className={css.srOnly}
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          Товарів у кошику: {count}
        </span>
      </Link>
    );
  }

  function navigation() {
    return links.map(({ href, label }) => (
      <Link
        key={href}
        href={href}
        className={css.navLink}
        onClick={closeMenu}
        aria-current={
          (
            href === '/'
              ? pathname === href
              : pathname === href || pathname.startsWith(`${href}/`)
          )
            ? 'page'
            : undefined
        }
      >
        {label}
      </Link>
    ));
  }

  function authActions() {
    return user ? (
      <>
        <Link
          href="/profile"
          className={css.authLink}
          onClick={closeMenu}
          aria-current={pathname === '/profile' ? 'page' : undefined}
        >
          Кабінет
        </Link>
        <button
          type="button"
          className={css.authLink}
          onClick={() => void logout()}
          disabled={loggingOut}
        >
          {loggingOut ? 'Вихід…' : 'Вийти'}
        </button>
      </>
    ) : (
      <>
        <Link href="/auth/login" className={css.authLink} onClick={closeMenu}>
          Вхід
        </Link>
        <Link
          href="/auth/register"
          className={`${css.authLink} ${css.register}`}
          onClick={closeMenu}
        >
          Реєстрація
        </Link>
      </>
    );
  }

  if (pathname === '/auth' || pathname.startsWith('/auth/')) {
    return (
      <header className={css.authHeader}>
        <div className={css.authContainer}>{brand()}</div>
      </header>
    );
  }

  return (
    <header className={css.header}>
      <div className={css.container}>
        {brand()}
        <nav aria-label="Основна навігація" className={css.desktopNav}>
          {navigation()}
        </nav>
        <div className={css.actions}>
          <div className={css.desktopAuth}>{authActions()}</div>
          <button
            type="button"
            className={`${css.iconButton} ${css.menuButton}`}
            aria-label="Відкрити меню"
            aria-expanded={menuOpen}
            aria-controls="header-mobile-menu"
            onClick={() => setMenuPath(pathname)}
          >
            <Icon name="menu" />
          </button>
          {cart()}
        </div>
      </div>
      {error && !menuOpen && (
        <p className={css.error} role="alert">
          {error}
        </p>
      )}
      <dialog
        ref={dialogRef}
        id="header-mobile-menu"
        className={css.mobileMenu}
        aria-label="Меню сайту"
        onCancel={closeMenu}
        onClose={closeMenu}
      >
        <div className={css.container}>
          {brand()}
          <div className={css.actions}>
            <button
              type="button"
              className={css.iconButton}
              aria-label="Закрити меню"
              onClick={closeMenu}
              autoFocus
            >
              <Icon name="close" />
            </button>
            {cart()}
          </div>
        </div>
        <div className={css.menuContent}>
          <nav aria-label="Мобільна навігація" className={css.mobileNav}>
            {navigation()}
          </nav>
          <div className={css.mobileAuth}>{authActions()}</div>
          {error && (
            <p className={css.error} role="alert">
              {error}
            </p>
          )}
        </div>
      </dialog>
    </header>
  );
}
