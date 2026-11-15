import { CategoriesList } from './CategoriesList';
import styles from './CategoriesPage.module.css';

export function CategoriesPage() {
  return (
    <section className={styles.categoriesSection}>
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>Категорії</h1>
        <CategoriesList />
      </div>
    </section>
  );
}

export default CategoriesPage;
