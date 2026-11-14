'use client';

import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from 'formik';
import * as Yup from 'yup';
import 'izitoast/dist/css/iziToast.min.css';
import Loader from '@/components/Loader/Loader';
import { subscribe } from '@/lib/api/client-api';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import { getServerErrorMessage, showToast } from '@/lib/toast';
import styles from './Footer.module.css';

interface Values {
  email: string;
}

const initialValues: Values = { email: '' };

const validationSchema = Yup.object({
  email: Yup.string()
    .trim()
    .email('Введіть коректну адресу електронної пошти')
    .required('Email є обовʼязковим полем'),
});

export default function SubscriptionForm() {
  const isTablet = useMediaQuery('(min-width: 768px)');

  const handleSubmit = async (
    values: Values,
    { resetForm }: FormikHelpers<Values>,
  ) => {
    try {
      const res = await subscribe(values.email.trim());
      showToast('success', res.message || 'Підписку успішно оформлено');
      resetForm();
    } catch (error) {
      showToast('error', getServerErrorMessage(error));
    }
  };

  return (
    <div className={styles.newsletter}>
      <div className={styles.newsletterText}>
        <h2 className={styles.heading}>Підписатися</h2>
        <p className={styles.description}>
          Приєднуйтесь до нашої розсилки, щоб бути в курсі новин та акцій.
        </p>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form className={styles.form} noValidate>
            <div className={styles.field}>
              <Field
                type="email"
                name="email"
                placeholder="Введіть ваш email"
                aria-label="Email"
                aria-invalid={Boolean(errors.email && touched.email)}
                aria-describedby="subscription-email-error"
                autoComplete="email"
                className={`${styles.input} ${
                  errors.email && touched.email ? styles.inputError : ''
                }`}
              />
              <ErrorMessage
                name="email"
                component="p"
                id="subscription-email-error"
                className={styles.error}
              />
            </div>
            <button
              type="submit"
              className={styles.button}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader size={isTablet ? 'md' : 'sm'} />
              ) : (
                'Підписатися'
              )}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
