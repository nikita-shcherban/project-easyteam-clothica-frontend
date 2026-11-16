'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createReview } from '@/lib/api/client-api';
import StarRating from '../StarRating/StarRating';
import css from './ReviewFormModal.module.css';
import { getServerErrorMessage, showToast } from '@/lib/toast';
import 'izitoast/dist/css/iziToast.min.css';

interface Props {
  goodId?: string;
  defaultName: string;
  isAuthenticated: boolean;
  onClose: () => void;
}

interface Values {
  authorName: string;
  text: string;
  rating: number;
}

const schema = Yup.object({
  authorName: Yup.string()
    .trim()
    .required('Введіть ваше ім’я')
    .max(50, 'Максимум 50 символів'),
  text: Yup.string().min(0).max(300, 'Максимум 300 символів'),
  rating: Yup.number()
    .min(1, 'Поставте оцінку')
    .max(5)
    .required('Поставте оцінку'),
});

export default function ReviewFormModal({
  goodId,
  defaultName,
  isAuthenticated,
  onClose,
}: Props) {
  const qc = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createReview,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reviews'] });
      showToast('success', 'Дякуємо за відгук!');
      onClose();
    },
    onError: (error) => showToast('error', getServerErrorMessage(error)),
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return createPortal(
    <div
      className={css.backdrop}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className={css.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-title"
      >
        <button
          type="button"
          className={css.close}
          onClick={onClose}
          aria-label="Закрити"
        >
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
            <path
              d="M5 5l14 14M19 5L5 19"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <h2 id="review-title" className={css.title}>
          Залишити відгук
        </h2>

        <Formik<Values>
          initialValues={{
            authorName: isAuthenticated ? defaultName : '',
            text: '',
            rating: 5,
          }}
          validationSchema={schema}
          onSubmit={async (v) => {
            if (!goodId) return;

            const trimmedName = v.authorName.trim();

            await mutateAsync({
              goodId,
              payload: {
                authorName: `${trimmedName}`,
                text: v.text.trim() || undefined,
                rating: v.rating,
              },
            });
          }}
        >
          {({ values, setFieldValue, setFieldTouched, errors, touched }) => (
            <Form className={css.form} noValidate>
              <label className={css.field}>
                <span className={css.label}>Ваше ім’я</span>
                <Field
                  name="authorName"
                  placeholder="Ваше ім’я"
                  className={`${css.input} ${touched.authorName && errors.authorName ? css.invalid : ''}`}
                  disabled={isAuthenticated}
                />
                <ErrorMessage
                  name="authorName"
                  component="span"
                  className={css.error}
                />
              </label>

              <label className={css.field}>
                <span className={css.label}>Відгук</span>
                <Field
                  as="textarea"
                  name="text"
                  placeholder="Ваш відгук"
                  rows={6}
                  className={`${css.input} ${css.textarea} ${touched.text && errors.text ? css.invalid : ''}`}
                />
                <span className={css.counter}>{values.text.length}/300</span>
                <ErrorMessage
                  name="text"
                  component="span"
                  className={css.error}
                />
              </label>

              <div className={css.field}>
                <StarRating
                  value={values.rating}
                  onChange={(n) => {
                    setFieldValue('rating', n);
                    setFieldTouched('rating', true, false);
                  }}
                />
                {touched.rating && errors.rating && (
                  <span className={css.error}>{errors.rating}</span>
                )}
              </div>

              <button type="submit" className={css.submit} disabled={isPending}>
                {isPending ? 'Надсилаємо…' : 'Надіслати'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>,
    document.body,
  );
}
