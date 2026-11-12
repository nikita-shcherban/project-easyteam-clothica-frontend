import type { Good } from '@/types/goods';
import GoodInfo from '../../GoodInfo/GoodInfo';
import MessageNoInfo from '../../MessageNoInfo/MessageNoInfo';
import Loader from '../../Loader/Loader';
import s from './GoodsList.module.css';

interface Props {
  goods: Good[];
  loading: boolean;
  onReset: () => void;
}

export default function GoodsList({ goods, loading, onReset }: Props) {
  const empty = !loading && goods.length === 0;
  return (
    <div className={s.wrap}>
      {loading && <Loader overlay />}
      {empty ? (
        <MessageNoInfo
          text="За вашим запитом не знайдено жодних товарів, спробуйте змінити фільтри, або скинути їх"
          buttonText="Скинути фільтри"
          onClick={onReset}
        />
      ) : (
        <ul className={s.list}>
          {goods.map((g) => (
            <li key={g._id}>
              <GoodInfo good={g} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
