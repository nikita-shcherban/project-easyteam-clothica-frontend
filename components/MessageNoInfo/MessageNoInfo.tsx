import s from './MessageNoInfo.module.css';

interface Props { text: string; buttonText: string; onClick: () => void }

export default function MessageNoInfo({ text, buttonText, onClick }: Props) {
  return (
    <div className={s.box}>
      <p className={s.text}>{text}</p>
      <button type="button" className={s.btn} onClick={onClick}>{buttonText}</button>
    </div>
  );
}
