'use client';

import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { Formik, type FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { registerUser, type RegisterUserData } from '@/lib/api/server-api';
import css from './RegistrationForm.module.css';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const phonePattern = /^\+[1-9]\d{7,14}$/;

const registrationSchema = Yup.object({
  username: Yup.string()
    .min(2, 'Ім’я має містити щонайменше 2 символи.')
    .max(300, 'Ім’я не може перевищувати 300 символів.')
    .test(
      'latin-cyrillic-only',
      'Дозволені лише літери латиниці та кирилиці',
      (value) => !value || /^[A-Za-zА-Яа-я]+$/.test(value.trim()),
    )
    .trim()
    .required('Введіть своє ім’я.'),
  phone: Yup.string()
    .required('Введіть номер телефону.')
    .test(
      'international-phone',
      'Введіть номер телефону у міжнародному форматі, наприклад +380XXXXXXXXX.',
      (value) => phonePattern.test((value ?? '').replace(/[-\s]/g, '')),
    ),
  password: Yup.string()
    .min(8, 'Пароль має містити щонайменше 8 символів.')
    .max(128, 'Пароль не може перевищувати 128 символів.')
    .test(
      'digit-required',
      'Має містити хоча б одну цифру',
      (value) => !value || /\d/.test(value),
    )
    .test(
      'upperase-required',
      'Має містити хоча б одну велику літеру',
      (value) => !value || /[A-ZА-Я]/.test(value),
    )
    .test(
      'special-character-required',
      'Має містити хоча б одну спеціальну літеру',
      (value) => !value || /[!@#$%^&*(),.?":{}|<>]/.test(value),
    )
    .test(
      'lowercase-required',
      'Має містити хоча б одну малу літеру',
      (value) => !value || /[a-zа-я]/.test(value),
    )
    .required('Введіть пароль.'),
});

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
        errors,
        handleBlur,
        handleChange,
        handleSubmit: submitForm,
        status,
        touched,
        values,
        isValid,
      }) => (
        <form className={css.form} onSubmit={submitForm} noValidate>
          <div className={css.field}>
            <label htmlFor="username">Ім’я*</label>
            <input
              autoComplete="name"
              id="username"
              name="username"
              onBlur={handleBlur}
              onChange={handleChange}
              placeholder="Ваше ім’я"
              value={values.username}
              className={
                errors.username && touched.username ? css.invalidInput : ''
              }
            />
            {touched.username && errors.username && (
              <p className={css.fieldError}>{errors.username}</p>
            )}
          </div>

          <div className={css.field}>
            <label htmlFor="phone">Номер телефону*</label>
            <input
              autoComplete="tel"
              id="phone"
              inputMode="tel"
              name="phone"
              onBlur={handleBlur}
              onChange={handleChange}
              placeholder="+38 (0__) __-__-__"
              type="tel"
              value={values.phone}
              className={errors.phone && touched.phone ? css.invalidInput : ''}
            />
            {touched.phone && errors.phone && (
              <p className={css.fieldError}>{errors.phone}</p>
            )}
          </div>

          <div className={css.field}>
            <label htmlFor="password">Пароль*</label>
            <div className={css.passwordInputContainer}>
              <input
                autoComplete="new-password"
                id="password"
                name="password"
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder="********"
                type={isPasswordVisible ? 'text' : 'password'}
                value={values.password}
                className={`${
                  errors.password && touched.password ? css.invalidInput : ''
                } ${css.passwordInput}`}
              />
              <button
                type="button"
                className={css.passwordVisibilityToggle}
                aria-label={
                  isPasswordVisible ? 'Приховати пароль' : 'Показати пароль'
                }
                aria-pressed={isPasswordVisible}
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                <span
                  className={`${css.passwordVisibilityIcon} ${
                    isPasswordVisible ? css.passwordHiddenIcon : ''
                  }`}
                />
              </button>
            </div>
            {touched.password && errors.password && (
              <p className={css.fieldError}>{errors.password}</p>
            )}
          </div>

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
