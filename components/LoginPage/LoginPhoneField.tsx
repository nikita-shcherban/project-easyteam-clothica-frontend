'use client';

import { useId, useState } from 'react';
import { useField } from 'formik';
import { IMaskInput } from 'react-imask';
import styles from './LoginPhoneField.module.css';

export default function LoginPhoneField() {
  const generatedId = useId();
  const id = generatedId;
  const [field, meta, helpers] = useField<string>('phone');
  const [hasPhoneDigits, setHasPhoneDigits] = useState(false);
  const error = meta.touched ? meta.error : undefined;

  return (
    <div className={styles.field}>
      <label htmlFor={id}>
        Номер телефону<span aria-hidden="true">*</span>
      </label>
      <IMaskInput
        id={id}
        name={field.name}
        type="text"
        inputMode="tel"
        autoComplete="username"
        mask={'+{38} (\\000) 000-00-00'}
        lazy={false}
        overwrite
        value={field.value}
        onAccept={(value) => {
          const digits = value.replace(/\D/g, '').replace(/^380/, '');
          setHasPhoneDigits(digits.length > 0);

          const nextValue = value.replace(/\D/g, '').length > 3 ? value : '';
          if (nextValue !== field.value) void helpers.setValue(nextValue);
        }}
        onBlur={field.onBlur}
        onPaste={(event) => {
          const digits = event.clipboardData.getData('text').replace(/\D/g, '');
          // Accept full national and international numbers from the clipboard.
          if (/^0\d{9}$/.test(digits) || /^380\d{9}$/.test(digits)) {
            event.preventDefault();
            void helpers.setValue(
              `+${digits.length === 10 ? '38' : ''}${digits}`,
            );
          }
        }}
        placeholder="+38 (0__) __-__-__"
        required
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={[
          styles.input,
          hasPhoneDigits ? styles.normalColor : styles.placeholderColor,
        ]
          .filter(Boolean)
          .join(' ')}
      />
      {error && (
        <p id={`${id}-error`} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  );
}
