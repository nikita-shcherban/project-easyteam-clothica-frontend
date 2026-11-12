'use client';

import { useId } from 'react';
import { useField } from 'formik';
import type {
  HTMLInputAutoCompleteAttribute,
  HTMLInputTypeAttribute,
} from 'react';
import styles from '@/components/LoginPage/LoginForm/LoginForm.module.css';

interface AuthFieldProps {
  name: string;
  label: string;
  type?: HTMLInputTypeAttribute;
  autoComplete: HTMLInputAutoCompleteAttribute;
  placeholder: string;
}

export default function AuthField({
  name,
  label,
  type = 'text',
  autoComplete,
  placeholder,
}: AuthFieldProps) {
  const id = useId();
  const [field, meta] = useField<string>(name);
  const error = meta.touched ? meta.error : undefined;

  return (
    <div className={styles.field}>
      <label htmlFor={id}>
        {label}
        <span aria-hidden="true">*</span>
      </label>
      <input
        {...field}
        id={id}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        required
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={styles.input}
      />
      {error && (
        <p id={`${id}-error`} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  );
}
