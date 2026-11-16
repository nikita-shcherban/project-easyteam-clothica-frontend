import styles from './StarRating.module.css';

interface Props {
  value: number;
  onChange?: (value: number) => void;
}

const MAX_STARS = 5;

const iconId = (value: number, i: number) =>
  value >= i + 1 ? 'star-filled' : value >= i + 0.5 ? 'star-half' : 'star';

export default function StarRating({ value, onChange }: Props) {
  if (!onChange) {
    return (
      <div
        className={styles.stars}
        role="img"
        aria-label={`Оцінка ${value} з ${MAX_STARS}`}
      >
        {Array.from({ length: MAX_STARS }, (_, i) => (
          <svg key={i} className={styles.star} aria-hidden="true">
            <use href={`/icons/icons.svg#${iconId(value, i)}`} />
          </svg>
        ))}
      </div>
    );
  }

  return (
    <div
      className={styles.stars}
      role="radiogroup"
      aria-label={`Оцінка ${value} з ${MAX_STARS}`}
    >
      {Array.from({ length: MAX_STARS }, (_, i) => (
        <button
          key={i}
          type="button"
          role="radio"
          aria-checked={value === i + 1}
          aria-label={`${i + 1} з ${MAX_STARS}`}
          className={styles.starBtn}
          onClick={() => onChange(i + 1)}
        >
          <svg className={styles.star} aria-hidden="true">
            <use href={`/icons/icons.svg#${iconId(value, i)}`} />
          </svg>
        </button>
      ))}
    </div>
  );
}
