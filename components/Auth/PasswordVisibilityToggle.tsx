'use client';

import css from './PasswordVisibilityToggle.module.css';

type PasswordVisibilityToggleProps = {
  isVisible: boolean;
  onToggle: () => void;
};

export default function PasswordVisibilityToggle({
  isVisible,
  onToggle,
}: PasswordVisibilityToggleProps) {
  return (
    <button
      type="button"
      className={css.toggle}
      aria-label={isVisible ? 'Приховати пароль' : 'Показати пароль'}
      aria-pressed={isVisible}
      onClick={onToggle}
    >
      <span
        className={`${css.icon} ${isVisible ? css.hiddenIcon : ''}`}
        aria-hidden="true"
      />
    </button>
  );
}
