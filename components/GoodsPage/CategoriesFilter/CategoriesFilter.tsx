'use client';
import { useState } from 'react';
import {
  SIZES,
  type Category,
  type Gender,
  type GoodsFilters,
  type Size,
} from '@/types/goods';
import PriceFilter from './PriceFilter';
import s from './CategoriesFilter.module.css';

interface Props {
  filters: GoodsFilters;
  categories: Category[];
  shown: number;
  total: number;
  onChange: (patch: Partial<GoodsFilters>) => void;
  onReset: () => void;
}

const GENDERS: { value: '' | Gender; label: string }[] = [
  { value: '', label: 'Всі' },
  { value: 'female', label: 'Жіночий' },
  { value: 'male', label: 'Чоловічий' },
  { value: 'unisex', label: 'Унісекс' },
];

function Group({
  title,
  onClear,
  children,
}: {
  title: string;
  onClear: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className={s.group}>
      <div className={s.row}>
        <h3 className={s.groupTitle}>{title}</h3>
        <button type="button" className={s.link} onClick={onClear}>
          Очистити
        </button>
      </div>
      {children}
    </section>
  );
}

export default function CategoriesFilter({
  filters,
  categories,
  shown,
  total,
  onChange,
  onReset,
}: Props) {
  const [open, setOpen] = useState(false);

  const toggleSize = (size: Size) =>
    onChange({
      sizes: filters.sizes.includes(size)
        ? filters.sizes.filter((x) => x !== size)
        : [...filters.sizes, size],
    });

  return (
    <aside className={s.filters}>
      <div className={s.row}>
        <h2 className={s.title}>Фільтри</h2>
        <button type="button" className={s.link} onClick={onReset}>
          Очистити всі
        </button>
      </div>
      <p className={s.count}>
        Показано {shown} з {total}
      </p>

      <button
        type="button"
        className={s.toggle}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        Фільтри
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={open ? s.flip : ''}
          aria-hidden
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      <div className={`${s.body} ${open ? s.open : ''}`}>
        <ul className={s.categories}>
          <li>
            <button
              type="button"
              className={!filters.category ? s.active : ''}
              onClick={() => onChange({ category: undefined })}
            >
              Усі
            </button>
          </li>
          {categories.map((c) => (
            <li key={c._id}>
              <button
                type="button"
                className={filters.category === c._id ? s.active : ''}
                onClick={() => onChange({ category: c._id })}
              >
                {c.name}
              </button>
            </li>
          ))}
        </ul>

        <Group title="Розмір" onClear={() => onChange({ sizes: [] })}>
          <div className={s.options}>
            {SIZES.map((size) => (
              <label key={size} className={s.option}>
                <input
                  type="checkbox"
                  className={s.checkbox}
                  checked={filters.sizes.includes(size)}
                  onChange={() => toggleSize(size)}
                />
                {size}
              </label>
            ))}
          </div>
        </Group>

        <Group
          title="Ціна"
          onClear={() => onChange({ minPrice: undefined, maxPrice: undefined })}
        >
          <PriceFilter
            min={filters.minPrice}
            max={filters.maxPrice}
            onChange={(minPrice, maxPrice) => onChange({ minPrice, maxPrice })}
          />
        </Group>

        <Group title="Стать" onClear={() => onChange({ gender: undefined })}>
          <div className={s.options}>
            {GENDERS.map((g) => (
              <label key={g.label} className={s.option}>
                <input
                  type="radio"
                  name="gender"
                  className={s.radio}
                  checked={(filters.gender ?? '') === g.value}
                  onChange={() => onChange({ gender: g.value || undefined })}
                />
                {g.label}
              </label>
            ))}
          </div>
        </Group>
      </div>
    </aside>
  );
}
