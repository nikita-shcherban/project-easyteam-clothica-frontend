'use client';

import { Formik } from 'formik';
import AuthField from '@/components/Auth/AuthField';
import AuthForm from '@/components/Auth/AuthForm';
import PasswordVisibilityToggle from '@/components/Auth/PasswordVisibilityToggle';
import LoginPhoneField from '@/components/LoginPage/LoginPhoneField';
import { login } from '@/lib/api/client-api';
import { getAuthErrorMessage } from '@/lib/auth/errors';
import { useAuthSubmit } from '@/lib/hooks/useAuthSubmit';
import { showToast } from '@/lib/toast';
import { useState } from 'react';
import {
  loginSchema,
  normalizePhone,
  type LoginValues,
} from '@/lib/validation/auth';
import styles from './LoginForm.module.css';

const initialValues: LoginValues = { phone: '', password: '' };

export default function LoginForm() {
  const { submit, redirecting } = useAuthSubmit(
    login,
    getAuthErrorMessage,
    (message) => showToast('error', message),
  );
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={loginSchema}
      onSubmit={(values) =>
        submit({ ...values, phone: normalizePhone(values.phone) })
      }
    >
      <AuthForm
        submitLabel="Увійти"
        pendingLabel="Входимо…"
        redirecting={redirecting}
      >
        <LoginPhoneField />
        <AuthField
          name="password"
          label="Пароль*"
          type={isPasswordVisible ? 'text' : 'password'}
          autoComplete="current-password"
          placeholder="********"
          inputClassName={`${styles.input} ${styles.passwordInput}`}
          inputWrapperClassName={styles.passwordInputContainer}
          inputAdornment={
            <PasswordVisibilityToggle
              isVisible={isPasswordVisible}
              onToggle={() => setIsPasswordVisible(!isPasswordVisible)}
            />
          }
        />
      </AuthForm>
    </Formik>
  );
}
