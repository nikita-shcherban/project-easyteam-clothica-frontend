import Link from 'next/link';
import type { Category } from '@/types/goods';
import { CATEGORY_IMAGES } from '@/lib/utils/category-images';
import styles from './CategoryCard.module.css';

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const base = `/images/categories/${CATEGORY_IMAGES[category._id]}`;

  return (
    <Link href={`/goods?category=${category._id}`} className={styles.card}>
      <picture>
        <source
          type="image/webp"
          srcSet={`${base}@1x.webp 1x, ${base}@2x.webp 2x`}
        />
        <img
          src={`${base}@1x.png`}
          srcSet={`${base}@1x.png 1x, ${base}@2x.png 2x`}
          alt={category.name}
          width={335}
          height={223}
          className={styles.image}
          loading="lazy"
        />
      </picture>
      <h3 className={styles.name}>{category.name}</h3>
    </Link>
  );
}

export default CategoryCard;
