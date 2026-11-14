import s from './Loader.module.css';

export type LoaderSize = 'sm' | 'md' | 'lg';

interface LoaderProps {
  overlay?: boolean;
  /** Компактний спінер (напр. всередині кнопки) — без відступів контейнера */
  size?: LoaderSize;
}

export default function Loader({ overlay = false, size }: LoaderProps) {
  const classes = [s.loader];
  if (overlay) classes.push(s.overlay);
  if (size) classes.push(s.inline);

  return (
    <div className={classes.join(' ')} role="status" aria-label="Завантаження">
      <span className={size ? `${s.spinner} ${s[size]}` : s.spinner} />
    </div>
  );
}
