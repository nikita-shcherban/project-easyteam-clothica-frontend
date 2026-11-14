import Image from 'next/image';
import Link from 'next/link';
import SubscriptionForm from './SubscriptionForm';
import styles from './Footer.module.css';

const NAV_LINKS = [
  { href: '/', label: 'Головна' },
  { href: '/goods', label: 'Товари' },
  { href: '/categories', label: 'Категорії' },
];

const SOCIAL_LINKS = [
  { href: 'https://www.facebook.com', label: 'Facebook', icon: 'facebook' },
  { href: 'https://www.instagram.com', label: 'Instagram', icon: 'instagram' },
  { href: 'https://x.com', label: 'X', icon: 'x' },
  { href: 'https://www.youtube.com', label: 'YouTube', icon: 'youtube' },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <Link
            href="/"
            className={styles.logo}
            aria-label="Clothica — на головну"
          >
            <Image
              src="/clothica-logo.svg"
              alt="Clothica"
              width={84}
              height={18}
            />
          </Link>

          <nav className={styles.nav} aria-label="Меню футера">
            <p className={styles.heading}>Меню</p>
            <ul className={styles.navList}>
              {NAV_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className={styles.navLink}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <SubscriptionForm />
        </div>

        <div className={styles.credits}>
          <p className={styles.copyright}>
            © 2026 Clothica. Всі права захищені.
          </p>
          <ul className={styles.socials}>
            {SOCIAL_LINKS.map(({ href, label, icon }) => (
              <li key={icon}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={styles.socialLink}
                >
                  <svg className={styles.socialIcon} aria-hidden="true">
                    <use href={`/icons/icons.svg#${icon}`} />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
