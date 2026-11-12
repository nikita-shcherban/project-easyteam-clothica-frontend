import Link from 'next/link';
import styles from './Hero.module.css';

export function Hero() {
  return (
    <section className={styles.hero} aria-label="Головний банер">
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.textColumn}>
            <h1 className={styles.title}>
              Знайди свій стиль з Clothica вже сьогодні!
            </h1>
            <p className={styles.description}>
              Clothica — це місце, де комфорт поєднується зі стилем. Ми
              створюємо базовий одяг, який легко комбінується та підходить для
              будь-якої нагоди. Обирай речі, що підкреслять твою індивідуальність
              і завжди будуть актуальними.
            </p>
            <div className={styles.actions}>
              <Link href="#popular-goods" className={styles.primaryButton}>
                До товарів
              </Link>
              <Link
                href="#popular-categories"
                className={styles.secondaryButton}
              >
                Дослідити категорії
              </Link>
            </div>
          </div>
          <div className={styles.imageWrapper}>
            <picture className={styles.picture}>
              {/* Desktop: min-width: 1440px */}
              <source
                media="(min-width: 1440px)"
                type="image/webp"
                srcSet="/images/hero-desktop@1x.webp 1x, /images/hero-desktop@2x.webp 2x"
              />
              <source
                media="(min-width: 1440px)"
                type="image/png"
                srcSet="/images/hero-desktop@1x.png 1x, /images/hero-desktop@2x.png 2x"
              />

              {/* Tablet: min-width: 768px */}
              <source
                media="(min-width: 768px)"
                type="image/webp"
                srcSet="/images/hero-tablet@1x.webp 1x, /images/hero-tablet@2x.webp 2x"
              />
              <source
                media="(min-width: 768px)"
                type="image/png"
                srcSet="/images/hero-tablet@1x.png 1x, /images/hero-tablet@2x.png 2x"
              />

              {/* Mobile: default (< 768px) */}
              <source
                type="image/webp"
                srcSet="/images/hero-mobile@1x.webp 1x, /images/hero-mobile@2x.webp 2x"
              />
              <source
                type="image/png"
                srcSet="/images/hero-mobile@1x.png 1x, /images/hero-mobile@2x.png 2x"
              />

              <img
                src="/images/hero-desktop@1x.webp"
                alt="Стильний базовий одяг Clothica"
                width={640}
                height={394}
                className={styles.image}
                loading="eager"
              />
            </picture>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
