'use client';

import { Formik } from 'formik';
import AuthField from '@/components/Auth/AuthField';
import AuthForm from '@/components/Auth/AuthForm';
import LoginPhoneField from './LoginPhoneField';
import { login } from '@/lib/api/auth';
import { useAuthSubmit } from '@/lib/hooks/useAuthSubmit';
import {
  loginSchema,
  normalizePhone,
  type LoginValues,
} from '@/lib/validation/auth';

const initialValues: LoginValues = { phone: '', password: '' };

export default function LoginForm() {
  const { submit, error, redirecting } = useAuthSubmit(login);

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
        error={error}
        redirecting={redirecting}
      >
        <LoginPhoneField />
        <AuthField
          name="password"
          label="Пароль"
          type="password"
          autoComplete="current-password"
          placeholder="********"
        />
      </AuthForm>
    </Formik>
  );
}
