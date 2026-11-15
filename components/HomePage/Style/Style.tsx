import Image from 'next/image';
import styles from './Style.module.css';

const benefits = [
  {
    id: 'quality',
    icon: '/images/style/first-icon.svg',
    title: 'Якість та натуральність',
    description:
      'Тільки приємні до тіла тканини, які зберігають форму навіть після десятків прань.',
  },
  {
    id: 'design',
    icon: '/images/style/second-icon.svg',
    title: 'Універсальний дизайн',
    description:
      'Базові кольори та лаконічний стиль, що легко комбінуються між собою.',
  },
  {
    id: 'comfort',
    icon: '/images/style/third-icon.svg',
    title: 'Комфорт на кожен день',
    description:
      'Одяг, який не обмежує рухів і підходить для будь-якої ситуації.',
  },
];

export default function Style() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Обери свій унікальний стиль сьогодні</h2>

        <ul className={styles.list}>
          {benefits.map(({ id, icon, title, description }) => (
            <li key={id} className={styles.item}>
              <Image
                src={icon}
                alt=""
                width={56}
                height={56}
                className={styles.icon}
              />

              <h3 className={styles.cardTitle}>{title}</h3>
              <p className={styles.description}>{description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
