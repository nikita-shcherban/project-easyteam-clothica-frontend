import css from './MessageNoInfo.module.css';

interface Props {
  text: string;
  buttonText: string;
  onClick: () => void;
}

export default function MessageNoInfo({ text, buttonText, onClick }: Props) {
  return (
    <div className={css.wrap}>
      <p className={css.text}>{text}</p>
      <button type="button" className={css.btn} onClick={onClick}>
        {buttonText}
      </button>
    </div>
  );
}
