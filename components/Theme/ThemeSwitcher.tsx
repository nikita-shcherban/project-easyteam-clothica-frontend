'use client';

import { isTheme } from '@/lib/theme';
import { useThemeStore } from '@/lib/store/theme-store';
import css from './ThemeSwitcher.module.css';

export default function ThemeSwitcher({
  compact = false,
}: {
  compact?: boolean;
}) {
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);

  return (
    <label className={compact ? css.compact : css.control}>
      <svg
        className={css.icon}
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        aria-hidden="true"
      >
        <path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z" />
      </svg>
      {!compact && <span>Тема оформлення</span>}
      <select
        className={css.select}
        aria-label="Тема оформлення"
        title="Тема оформлення"
        value={theme}
        onChange={(event) => {
          if (isTheme(event.target.value)) setTheme(event.target.value);
        }}
      >
        <option value="light">Світла</option>
        <option value="dark">Темна</option>
        <option value="system">Як у системі</option>
      </select>
    </label>
  );
}
