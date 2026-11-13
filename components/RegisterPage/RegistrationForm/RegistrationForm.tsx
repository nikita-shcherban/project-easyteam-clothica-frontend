'use client';

import { Formik } from 'formik';
import AuthField from '@/components/Auth/AuthField';
import PasswordVisibilityToggle from '@/components/Auth/PasswordVisibilityToggle';
import LoginPhoneField from '@/components/LoginPage/LoginPhoneField';
import {
  register,
  type RegisterUserData,
} from '@/lib/api/client-api';
import { getRegistrationErrorMessage } from '@/lib/auth/errors';
import { useAuthSubmit } from '@/lib/hooks/useAuthSubmit';
import { registrationSchema } from '@/lib/validation/auth';
import css from './RegistrationForm.module.css';
import { useState } from 'react';

const initialValues: RegisterUserData = {
  username: '',
  phone: '',
  password: '',
};

export default function RegistrationForm() {
  const { submit, error, redirecting } = useAuthSubmit(
    register,
    getRegistrationErrorMessage,
  );
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values) =>
        submit({
          ...values,
          username: values.username.trim(),
          phone: values.phone.replace(/[^\d+]/g, ''),
        })
      }
      validationSchema={registrationSchema}
    >
      {({
        handleSubmit: submitForm,
        isValid,
        isSubmitting,
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
            {error && (
              <p className={css.error} role="alert">
                {error}
              </p>
            )}

            <button
              className={css.submit}
              disabled={!isValid || isSubmitting || redirecting}
              type="submit"
            >
              {isSubmitting || redirecting
                ? 'Реєстрація...'
                : 'Зареєструватися'}
            </button>
          </div>
        </form>
      )}
    </Formik>
  );
}
