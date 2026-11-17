'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useUserProfile } from '@/lib/hooks/useUserProfile';
import { useAuthStore } from '@/lib/store/auth-store';
import { showToast } from '@/lib/toast';
import Loader from '@/components/Loader/Loader';
import styles from './PersonalPage.module.css';

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
    .trim()
    .test(
      'phone-valid',
      'Введіть коректний номер телефону (+380...)',
      (value) => {
        if (!value) return false;
        const digits = value.replace(/\D/g, '');
        return digits.length >= 10 && digits.length <= 13;
      },
    )
    .required("Обов'язкове поле"),
  city: Yup.string()
    .trim()
    .min(2, 'Мінімум 2 символи')
    .max(50, 'Максимум 50 символів')
    .required("Обов'язкове поле"),
  novaPoshtaBranch: Yup.string()
    .trim()
    .required("Обов'язкове поле"),
});

export function PersonalPage() {
  const router = useRouter();
  const { user, loading, saveProfile, loadProfile } = useUserProfile();
  const isAuthLoading = useAuthStore((state) => state.isAuthLoading);

  useEffect(() => {
    if (!user && !isAuthLoading) {
      void loadProfile();
    }
  }, [user, isAuthLoading, loadProfile]);

  const formik = useFormik({
    initialValues: {
      name: user?.name || user?.username || '',
      surname: user?.surname || '',
      phone: user?.phone || '',
      city: user?.city || '',
      novaPoshtaBranch: user?.novaPoshtaBranch || '',
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      const normalizedPhone = values.phone.startsWith('+')
        ? values.phone
        : `+${values.phone.replace(/\D/g, '')}`;

      const success = await saveProfile({
        name: values.name,
        surname: values.surname,
        phone: normalizedPhone,
        city: values.city,
        novaPoshtaBranch: values.novaPoshtaBranch,
      });

      if (success) {
        void showToast('success', 'Дані профілю успішно оновлено!');
        router.push('/profile');
      }
    },
  });

  if (loading || isAuthLoading) {
    return <Loader overlay size="lg" />;
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Link href="/profile" className={styles.backLink}>
          ← Назад до кабінету
        </Link>

        <div className={styles.card}>
          <h1 className={styles.title}>Редагування даних</h1>
          <p className={styles.subtitle}>
            Оновіть ваші персональні дані та адресу доставки
          </p>

          <form className={styles.form} onSubmit={formik.handleSubmit} noValidate>
            <div className={styles.fieldsGrid}>
              {/* Ім'я */}
              <div className={styles.field}>
                <label htmlFor="name" className={styles.label}>
                  Ім&apos;я*
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Ваше ім'я"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`${styles.input} ${
                    formik.touched.name && formik.errors.name ? styles.inputError : ''
                  }`}
                />
                {formik.touched.name && formik.errors.name && (
                  <span className={styles.errorText}>{formik.errors.name}</span>
                )}
              </div>

              {/* Прізвище */}
              <div className={styles.field}>
                <label htmlFor="surname" className={styles.label}>
                  Прізвище*
                </label>
                <input
                  type="text"
                  id="surname"
                  name="surname"
                  placeholder="Ваше прізвище"
                  value={formik.values.surname}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`${styles.input} ${
                    formik.touched.surname && formik.errors.surname
                      ? styles.inputError
                      : ''
                  }`}
                />
                {formik.touched.surname && formik.errors.surname && (
                  <span className={styles.errorText}>{formik.errors.surname}</span>
                )}
              </div>

              {/* Телефон */}
              <div className={`${styles.field} ${styles.fullWidthField}`}>
                <label htmlFor="phone" className={styles.label}>
                  Номер телефону*
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="+38 (0__) ___-__-__"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`${styles.input} ${
                    formik.touched.phone && formik.errors.phone ? styles.inputError : ''
                  }`}
                />
                {formik.touched.phone && formik.errors.phone && (
                  <span className={styles.errorText}>{formik.errors.phone}</span>
                )}
              </div>

              {/* Місто */}
              <div className={styles.field}>
                <label htmlFor="city" className={styles.label}>
                  Місто доставки*
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  placeholder="Введіть ваше місто"
                  value={formik.values.city}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`${styles.input} ${
                    formik.touched.city && formik.errors.city ? styles.inputError : ''
                  }`}
                />
                {formik.touched.city && formik.errors.city && (
                  <span className={styles.errorText}>{formik.errors.city}</span>
                )}
              </div>

              {/* Відділення Нової Пошти */}
              <div className={styles.field}>
                <label htmlFor="novaPoshtaBranch" className={styles.label}>
                  Відділення Нової Пошти*
                </label>
                <input
                  type="text"
                  id="novaPoshtaBranch"
                  name="novaPoshtaBranch"
                  placeholder="№ відділення (наприклад, 12)"
                  value={formik.values.novaPoshtaBranch}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`${styles.input} ${
                    formik.touched.novaPoshtaBranch && formik.errors.novaPoshtaBranch
                      ? styles.inputError
                      : ''
                  }`}
                />
                {formik.touched.novaPoshtaBranch && formik.errors.novaPoshtaBranch && (
                  <span className={styles.errorText}>
                    {formik.errors.novaPoshtaBranch}
                  </span>
                )}
              </div>
            </div>

            <div className={styles.actions}>
              <Link href="/profile" className={styles.cancelButton}>
                Скасувати
              </Link>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={loading || !formik.isValid}
              >
                Зберегти зміни
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PersonalPage;
