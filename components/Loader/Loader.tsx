import s from './Loader.module.css';

export default function Loader({ overlay = false }: { overlay?: boolean }) {
  return (
    <div className={overlay ? `${s.loader} ${s.overlay}` : s.loader} role="status" aria-label="Завантаження">
      <span className={s.spinner} />
    </div>
  );
}
