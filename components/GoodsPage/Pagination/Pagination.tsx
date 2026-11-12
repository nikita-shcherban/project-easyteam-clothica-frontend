import Loader from '../../Loader/Loader';
import s from './Pagination.module.css';

interface Props {
  loading: boolean;
  onClick: () => void;
}

export default function Pagination({ loading, onClick }: Props) {
  return (
    <div className={s.wrap}>
      {loading ? (
        <Loader />
      ) : (
        <button type="button" className={s.btn} onClick={onClick}>
          Показати більше
        </button>
      )}
    </div>
  );
}
