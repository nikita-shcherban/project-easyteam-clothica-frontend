'use client';

import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { Formik, type FormikHelpers } from 'formik';
import AuthField from '@/components/Auth/AuthField';
import PasswordVisibilityToggle from '@/components/Auth/PasswordVisibilityToggle';
import LoginPhoneField from '@/components/LoginPage/LoginPhoneField';
import {
  register as registerUser,
  type RegisterUserData,
} from '@/lib/api/client-api';
import { registrationSchema } from '@/lib/validation/auth';
import css from './RegistrationForm.module.css';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const initialValues: RegisterUserData = {
  username: '',
  phone: '',
  password: '',
};

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    if (error.response?.status === 409) {
      return 'Користувач із таким номером телефону вже зареєстрований.';
    }

    return (
      error.response?.data?.message ??
      'Не вдалося зареєструватися. Спробуйте ще раз.'
    );
  }

  return 'Сталася неочікувана помилка. Спробуйте ще раз.';
}

export default function RegistrationForm() {
  const registrationMutation = useMutation({
    mutationFn: registerUser,
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { push } = useRouter();

  const handleSubmit = (
    values: RegisterUserData,
    helpers: FormikHelpers<RegisterUserData>,
  ) => {
    helpers.setStatus(undefined);
    registrationMutation.reset();

    registrationMutation.mutate(
      {
        ...values,
        username: values.username.trim(),
        phone: values.phone.replace(/[^\d+]/g, ''),
      },
      {
        onSuccess: () => push('/'),
        onError: (error) => helpers.setStatus(getErrorMessage(error)),
      },
    );
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={registrationSchema}
    >
      {({
        handleSubmit: submitForm,
        status,
        isValid,
      }) => (
        <form className={css.form} onSubmit={submitForm} noValidate>
          <AuthField
            name="username"
            label="Ім’я*"
            id="username"
            autoComplete="name"
            placeholder="Ваше ім’я"
            required={false}
            validationAccessibility={false}
            fieldClassName={css.field}
            inputClassName=""
            invalidInputClassName={css.invalidInput}
            errorClassName={css.fieldError}
          />

          <LoginPhoneField
            id="phone"
            autoComplete="tel"
            placeholder="+38 (0__) __-__-__"
            fieldClassName={css.field}
            inputClassName=""
            invalidInputClassName={css.invalidInput}
            errorClassName={css.fieldError}
            required={false}
            validationAccessibility={false}
          />

          <AuthField
            name="password"
            label="Пароль*"
            id="password"
            type={isPasswordVisible ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="********"
            required={false}
            validationAccessibility={false}
            fieldClassName={css.field}
            inputClassName={css.passwordInput}
            invalidInputClassName={css.invalidInput}
            inputWrapperClassName={css.passwordInputContainer}
            errorClassName={css.fieldError}
            inputAdornment={
              <PasswordVisibilityToggle
                isVisible={isPasswordVisible}
                onToggle={() => setIsPasswordVisible(!isPasswordVisible)}
              />
            }
          />

          <div className={css.actions}>
            {status && (
              <p className={css.error} role="alert">
                {status}
              </p>
            )}
            {registrationMutation.isSuccess && (
              <p className={css.success} role="status">
                Вітаємо! Ваш обліковий запис Clothica створено.
              </p>
            )}

            <button
              className={css.submit}
              disabled={!isValid || registrationMutation.isPending}
              type="submit"
            >
              {registrationMutation.isPending
                ? 'Реєстрація...'
                : 'Зареєструватися'}
            </button>
          </div>
        </form>
      )}
    </Formik>
  );
}
