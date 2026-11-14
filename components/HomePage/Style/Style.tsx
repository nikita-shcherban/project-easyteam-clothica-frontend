import Image from 'next/image';
import styles from './Style.module.css';

const benefits = [
  {
    id: 1,
    icon: '/icons/quality.svg',
    title: 'Якість та натуральність',
    description:
      'тільки приємні до тіла тканини, які зберігають форму навіть після десятків прань.',
  },
  {
    id: 2,
    icon: '/icons/design.svg',
    title: 'Універсальний дизайн',
    description:
      'базові кольори та лаконічний стиль, що легко комбінуються між собою.',
  },
  {
    id: 3,
    icon: '/icons/comfort.svg',
    title: 'Комфорт на кожен день',
    description:
      'одяг, який не обмежує рухів і підходить для будь-якої ситуації.',
  },
];

export function Style() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.sectionTitle}>
          <h2 className={styles.title}>
            Обери свій унікальний стиль сьогодні
          </h2>
        </div>

        <ul className={styles.list}>
          {benefits.map(({ id, icon, title, description }) => (
            <li className={styles.card} key={id}>
              <Image
                src={icon}
                alt=""
                width={56}
                height={56}
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

export default Style;