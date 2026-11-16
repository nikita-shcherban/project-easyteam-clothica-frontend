'use client';
import { useEffect } from 'react';
import styles from './LogoutModal.module.css';

interface LogoutModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export default function LogoutModal({ onConfirm, onCancel }: LogoutModalProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCancel();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onCancel]);
  return (
    <div
      className={styles.overlay}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onCancel();
        }
      }}
    >
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-modal-title"
      >
        <h2 id="logout-modal-title">Ви впевнені, що хочете вийти?</h2>
        <div className={styles.actions}>
          <button type="button" onClick={onConfirm}>
            Так
          </button>
          <button type="button" onClick={onCancel}>
            Ні
          </button>
        </div>
      </div>
    </div>
  );
}
