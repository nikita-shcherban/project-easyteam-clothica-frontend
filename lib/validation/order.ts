import * as Yup from 'yup';

const REQUIRED = "Обов'язкове поле";

export const orderSchema = Yup.object({
  firstName: Yup.string()
    .trim()
    .min(2, 'Мінімум 2 символи')
    .max(50, 'Максимум 50 символів')
    .required(REQUIRED),
  lastName: Yup.string()
    .trim()
    .min(2, 'Мінімум 2 символи')
    .max(50, 'Максимум 50 символів')
    .required(REQUIRED),
  // бекенд приймає лише +380XXXXXXXXX
  phone: Yup.string()
    .matches(/^\+380\d{9}$/, 'Формат: +380XXXXXXXXX')
    .required(REQUIRED),
  city: Yup.string().trim().max(100, 'Занадто довга назва').required(REQUIRED),
  novaPoshtaBranch: Yup.string()
    .trim()
    .max(50, 'Занадто довге значення')
    .required(REQUIRED),
  comment: Yup.string().trim().max(500, 'Максимум 500 символів'),
});
