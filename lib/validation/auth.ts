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
