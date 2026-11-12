'use client';

import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { Form, useFormikContext } from 'formik';
import styles from '@/components/LoginPage/LoginForm/LoginForm.module.css';

interface AuthFormProps {
  children: ReactNode;
  submitLabel: string;
  pendingLabel: string;
  error: string | null;
  redirecting: boolean;
}

export default function AuthForm({
  children,
  submitLabel,
  pendingLabel,
  error,
  redirecting,
}: AuthFormProps) {
  const { isSubmitting, isValidating, submitCount, errors } =
    useFormikContext();
  const formRef = useRef<HTMLFormElement>(null);
  const focusedAttempt = useRef(0);
  const busy = isSubmitting || redirecting;

  useEffect(() => {
    if (isValidating || isSubmitting || submitCount === focusedAttempt.current)
      return;
    focusedAttempt.current = submitCount;
    if (Object.keys(errors).length) {
      formRef.current
        ?.querySelector<HTMLInputElement>('[aria-invalid="true"]')
        ?.focus();
    }
  }, [errors, isSubmitting, isValidating, submitCount]);

  return (
    <Form ref={formRef} noValidate className={styles.form} aria-busy={busy}>
      <fieldset disabled={busy} className={styles.fields}>
        {children}
        <button type="submit" disabled={busy} className={styles.submit}>
          {busy && <span className={styles.spinner} aria-hidden="true" />}
          {busy ? pendingLabel : submitLabel}
        </button>
      </fieldset>
      <span role="status" className={styles.srOnly}>
        {busy ? pendingLabel : ''}
      </span>
      {error && (
        <p role="alert" className={styles.requestError}>
          {error}
        </p>
      )}
    </Form>
  );
}
