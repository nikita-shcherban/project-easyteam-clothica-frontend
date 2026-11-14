import Link from "next/link";
import styles from "./PopularCategories.module.css";

const categories = [
  {
    id: "tshirts",
    name: "Футболки",
    image: "/images/category-tshirts@2x.png",
  },
  {
    id: "hoodies",
    name: "Худі та світшоти",
    image: "/images/category-hoodies@2x.png",
  },
  {
    id: "jeans",
    name: "Джинси та штани",
    image: "/images/category-jeans@2x.png",
  },
];

export default function PopularCategories() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.titleRow}>
          <h2 className={styles.title}>Популярні категорії</h2>

          <Link href="/categories" className={styles.allCategoriesLink}>
            Всі категорії
          </Link>
        </div>

        <div className={styles.categories}>
          {categories.map((category) => (
            <article className={styles.card} key={category.id}>
              <img
                className={styles.image}
                src={category.image}
                alt={category.name}
              />

              <h3 className={styles.name}>{category.name}</h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}