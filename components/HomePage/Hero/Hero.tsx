import Image from "next/image";
import Link from "next/link";
import styles from "./Hero.module.css";

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
              <Link href="/goods" className={styles.primaryButton}>
                До товарів
              </Link>
              <Link href="/categories" className={styles.secondaryButton}>
                Дослідити категорії
              </Link>
            </div>
          </div>
          <div className={styles.imageWrapper}>
            <Image
              src="/images/hero.png"
              alt="Стильний базовий одяг Clothica"
              width={640}
              height={394}
              priority
              className={styles.image}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
