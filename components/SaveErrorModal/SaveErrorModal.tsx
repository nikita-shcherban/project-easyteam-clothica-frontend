'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useSaveErrorStore } from '@/lib/store/save-error-store';
import styles from './SaveErrorModal.module.css';

export default function SaveErrorModal() {
  const { isOpen, message, hideSaveError } = useSaveErrorStore();
  const okRef = useRef<HTMLButtonElement>(null);

  // Лише для розробки: відкрити модалку через ?saveError у адресі
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    if (new URLSearchParams(window.location.search).has('saveError')) {
      useSaveErrorStore.getState().showSaveError();
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') hideSaveError();
    };
    document.addEventListener('keydown', onKeyDown);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    okRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, hideSaveError]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className={styles.backdrop}
      onClick={(e) => {
        if (e.target === e.currentTarget) hideSaveError();
      }}
    >
      <div
        className={styles.modal}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="save-error-title"
        aria-describedby="save-error-text"
      >
        <button
          type="button"
          className={styles.close}
          onClick={hideSaveError}
          aria-label="Закрити"
        >
          <svg className={styles.closeIcon} aria-hidden="true">
            <use href="/icons/icons.svg#close" />
          </svg>
        </button>

        <h2 id="save-error-title" className={styles.title}>
          Помилка збереження
        </h2>
        <p id="save-error-text" className={styles.text}>
          {message}
        </p>

        <button
          ref={okRef}
          type="button"
          className={styles.ok}
          onClick={hideSaveError}
        >
          Зрозуміло
        </button>
      </div>
    </div>,
    document.body,
  );
}
