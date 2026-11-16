'use client';

import { useFormik } from 'formik';
import { IMaskInput } from 'react-imask';
import Loader from '@/components/Loader/Loader';
import * as Yup from 'yup';
import styles from './UserInfoForm.module.css';
import { useUserProfile } from '@/lib/hooks/useUserProfile';
import { showToast } from '@/lib/toast';

const validationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(2, 'Мінімум 2 символи')
    .max(32, 'Максимум 32 символи')
    .required("Обов'язкове поле"),
  surname: Yup.string()
    .trim()
    .min(2, 'Мінімум 2 символи')
    .max(32, 'Максимум 32 символи')
    .required("Обов'язкове поле"),
  phone: Yup.string()
    .test(
      'phone-format',
      'Введіть повний номер у форматі +38 (099) 123-45-67',
      (value) => {
        if (!value || !value.replace(/\D/g, '').length) return true;
        const digits = value.replace(/\D/g, '');

        const normalized = digits.startsWith('380')
          ? `+${digits}`
          : `+38${digits}`;
        return /^\+380\d{9}$/.test(normalized);
      },
      // /^\+380\d{9}$/.test(value?.replace(/\D/g, '').replace(/^/, '+') ?? ''),
    )
    .required("Обов'язкове поле"),
  city: Yup.string()
    .trim()
    .min(2, 'Мінімум 2 символи')
    .max(50, 'Максимум 50 символів')
    .required("Обов'язкове поле"),
  postOficce: Yup.string().trim().required("Обов'язкове поле"),
});

export default function UserInfoForm() {
  const { user, loading, error, saveProfile } = useUserProfile();

  const formik = useFormik({
    initialValues: {
      name: user?.name ?? '',
      surname: user?.surname ?? '',
      phone: user?.phone ?? '',
      city: user?.city ?? '',
      postOficce: user?.novaPoshtaBranch ?? '',
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      const success = await saveProfile({
        name: values.name,
        surname: values.surname,
        phone: `+${values.phone.replace(/\D/g, '')}`,
        city: values.city,
        novaPoshtaBranch: values.postOficce,
      });
      if (success) {
        void showToast('success', 'Дані успішно збережено');
      } else {
        // Ошибка уже сохраняется в useUserProfile
        // Пока оставляем её отображение через error в форме
      }
    },
  });

  if (loading && !user) {
    return <Loader />;
  }
  return (
    <section className={styles.userInfo}>
      <h2 className={styles.title}>Особиста інформація</h2>
      {error && (
        <p role="alert" className={styles.error}>
          {error}
        </p>
      )}
      <form className={styles.form} onSubmit={formik.handleSubmit} noValidate>
        <div className={styles.fieldsRow}>
          <div className={styles.field}>
            <label htmlFor="firstName">Ім&apos;я*</label>
            <input
              type="text"
              id="firstName"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              aria-invalid={Boolean(formik.touched.name && formik.errors.name)}
              placeholder="Ваше ім'я"
            />
            {formik.touched.name && formik.errors.name && (
              <div className={styles.error}>{formik.errors.name}</div>
            )}
          </div>
          <div className={styles.field}>
            <label htmlFor="lastName">Прізвище*</label>
            <input
              type="text"
              id="lastName"
              name="surname"
              value={formik.values.surname}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              aria-invalid={Boolean(
                formik.touched.surname && formik.errors.surname,
              )}
              placeholder="Ваше прізвище"
            />
            {formik.touched.surname && formik.errors.surname && (
              <div className={styles.error}>{formik.errors.surname}</div>
            )}
          </div>
        </div>
        <div className={styles.field}>
          <label htmlFor="phone">Номер телефону*</label>
          <IMaskInput
            mask="+{38} (\000) 000-00-00"
            lazy={false}
            overwrite
            type="tel"
            id="phone"
            name="phone"
            className={[
              styles.input,
              formik.values.phone.replace(/\D/g, '').replace(/^380/, '')
                ? styles.normalColor
                : styles.placeholderColor,
            ].join(' ')}
            value={formik.values.phone}
            onAccept={(value) => {
              const nextValue =
                value.replace(/\D/g, '').length > 3 ? value : '';

              void formik.setFieldValue('phone', nextValue);
            }}
            onBlur={formik.handleBlur}
            aria-invalid={Boolean(formik.touched.phone && formik.errors.phone)}
            placeholder="+38 (0__) --_"
            autoComplete="tel"
          />
          {formik.touched.phone && formik.errors.phone && (
            <div className={styles.error}>{formik.errors.phone}</div>
          )}
        </div>
        <div className={styles.fieldsRow}>
          <div className={styles.field}>
            <label htmlFor="city">Місто доставки*</label>
            <input
              type="text"
              id="city"
              name="city"
              placeholder="Ваше місто"
              value={formik.values.city}
              onChange={formik.handleChange}
              aria-invalid={Boolean(formik.touched.city && formik.errors.city)}
              onBlur={formik.handleBlur}
            />
            {formik.touched.city && formik.errors.city && (
              <div className={styles.error}>{formik.errors.city}</div>
            )}
          </div>
          <div className={styles.field}>
            <label htmlFor="postOficce">Номер відділення Нової Пошти*</label>
            <input
              type="text"
              id="postOficce"
              name="postOficce"
              value={formik.values.postOficce}
              onChange={formik.handleChange}

              onBlur={formik.handleBlur}
              aria-invalid={Boolean(
                formik.touched.postOficce && formik.errors.postOficce,
              )}
              placeholder="1"
            />
            {formik.touched.postOficce && formik.errors.postOficce && (
              <div className={styles.error}>{formik.errors.postOficce}</div>
            )}
          </div>
        </div>
        <button
          type="submit"
          className={styles.saveButton}
          disabled={loading || !formik.dirty || !formik.isValid}
        >
          Зберегти зміни
        </button>
      </form>
    </section>
  );
}
