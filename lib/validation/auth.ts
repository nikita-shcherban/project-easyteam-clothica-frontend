import * as yup from 'yup';

// The backend accepts international E.164 phone numbers, not email addresses.
export const normalizePhone = (value: string) => value.replace(/[\s()-]/g, '');

const phone = yup
  .string()
  .transform((value: unknown) =>
    typeof value === 'string' ? normalizePhone(value) : value,
  )
  .required('Введіть номер телефону')
  .matches(
    /^\+380\d{9}$/,
    'Введіть повний номер у форматі +38 (099) 123-45-67',
  );

export const loginSchema = yup.object({
  phone,
  // Do not apply new-password rules to existing accounts or trim passwords.
  password: yup.string().required('Введіть пароль'),
});

export type LoginValues = yup.InferType<typeof loginSchema>;

const registrationPhonePattern = /^\+[1-9]\d{7,14}$/;

export const registrationSchema = yup.object({
  username: yup
    .string()
    .min(2, 'Ім’я має містити щонайменше 2 символи.')
    .max(300, 'Ім’я не може перевищувати 300 символів.')
    .test(
      'latin-cyrillic-only',
      'Дозволені лише літери латиниці та кирилиці',
      (value) => !value || /^[A-Za-zА-Яа-я]+$/.test(value.trim()),
    )
    .trim()
    .required('Введіть своє ім’я.'),
  phone: yup
    .string()
    .required('Введіть номер телефону.')
    .test(
      'international-phone',
      'Введіть номер телефону у міжнародному форматі, наприклад +380XXXXXXXXX.',
      (value) =>
        registrationPhonePattern.test((value ?? '').replace(/[^\d+]/g, '')),
    ),
  password: yup
    .string()
    .min(8, 'Пароль має містити щонайменше 8 символів.')
    .max(128, 'Пароль не може перевищувати 128 символів.')
    .test(
      'digit-required',
      'Має містити хоча б одну цифру',
      (value) => !value || /\d/.test(value),
    )
    .test(
      'uppercase-required',
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

export type RegistrationValues = yup.InferType<typeof registrationSchema>;
