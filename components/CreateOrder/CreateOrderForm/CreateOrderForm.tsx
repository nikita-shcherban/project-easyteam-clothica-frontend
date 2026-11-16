'use client';

import Loader from '@/components/Loader/Loader';
import { createOrder } from '@/lib/api/client-api';
import { useAuthStore } from '@/lib/store/auth-store';
import { useBasketStore } from '@/lib/store/basket-store';
import { useSaveErrorStore } from '@/lib/store/save-error-store';
import { getServerErrorMessage, showToast } from '@/lib/toast';
import { orderSchema } from '@/lib/validation/order';
import { useMutation } from '@tanstack/react-query';
import { Form, Formik, FormikHelpers, useField } from 'formik';
import { useRouter } from 'next/navigation';
import { IMaskInput } from 'react-imask';
import styles from './CreateOrderForm.module.css';

interface FormValues {
  firstName: string;
  lastName: string;
  phone: string;
  city: string;
  novaPoshtaBranch: string;
  comment: string;
}

interface FieldProps {
  name: keyof FormValues;
  label: string;
  placeholder: string;
  required?: boolean;
  textarea?: boolean;
  wide?: boolean;
  mask?: boolean;
}

function Field({
  name,
  label,
  placeholder,
  required,
  textarea,
  wide,
  mask,
}: FieldProps) {
  const [field, meta, helpers] = useField(name);
  const hasError = meta.touched && !!meta.error;
  const inputClass = `${styles.input} ${hasError ? styles.inputError : ''}`;

  return (
    <label className={`${styles.field} ${wide ? styles.wide : ''}`}>
      <span className={styles.label}>
        {label}
        {required && '*'}
      </span>

      {mask ? (
        <IMaskInput
          className={inputClass}
          mask="+{38} (000) 000-00-00"
          placeholder={placeholder}
          value={field.value}
          onBlur={() => helpers.setTouched(true)}
          // у форму кладемо чисте значення: +380991234567
          onAccept={(_value, maskRef) =>
            helpers.setValue(
              maskRef.unmaskedValue ? `+${maskRef.unmaskedValue}` : '',
            )
          }
        />
      ) : textarea ? (
        <textarea
          {...field}
          className={`${inputClass} ${styles.textarea}`}
          placeholder={placeholder}
        />
      ) : (
        <input {...field} className={inputClass} placeholder={placeholder} />
      )}

      {hasError && <span className={styles.error}>{meta.error}</span>}
    </label>
  );
}

export default function CreateOrderForm() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const items = useBasketStore((s) => s.items);
  const clear = useBasketStore((s) => s.clear);
  const showSaveError = useSaveErrorStore((s) => s.showSaveError);

  const mutation = useMutation({ mutationFn: createOrder });

  // дані з профілю підставляються за замовчуванням
  const initialValues: FormValues = {
    firstName: user?.name ?? '',
    lastName: user?.surname ?? '',
    phone: user?.phone ?? '',
    city: user?.city ?? '',
    novaPoshtaBranch: user?.novaPoshtaBranch ?? '',
    comment: '',
  };

  const handleSubmit = (
    values: FormValues,
    actions: FormikHelpers<FormValues>,
  ) => {
    mutation.mutate(
      {
        ...values,
        comment: values.comment || undefined,
        items: items.map(({ goodId, size, quantity }) => ({
          goodId,
          size,
          quantity,
        })),
      },
      {
        onSuccess: () => {
          clear();
          if (user) {
            router.push('/profile');
          } else {
            showToast(
              'success',
              "Ваше замовлення створено. Чекайте на зворотній зв'язок",
            );
            actions.resetForm();
          }
        },
        // форма лишається відкритою, показуємо модалку «Помилка збереження»
        onError: (error) => showSaveError(getServerErrorMessage(error)),
      },
    );
  };

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      validationSchema={orderSchema}
      onSubmit={handleSubmit}
    >
      <Form className={styles.form} noValidate>
        <h2 className={styles.subtitle}>Особиста інформація</h2>

        <div className={styles.grid}>
          <Field
            name="firstName"
            label="Ім'я"
            placeholder="Ваше ім'я"
            required
          />
          <Field
            name="lastName"
            label="Прізвище"
            placeholder="Ваше прізвище"
            required
          />
          <Field
            name="phone"
            label="Номер телефону"
            placeholder="+38 (0__) ___-__-__"
            required
            wide
            mask
          />
          <Field
            name="city"
            label="Місто доставки"
            placeholder="Ваше місто"
            required
          />
          <Field
            name="novaPoshtaBranch"
            label="Номер відділення Нової Пошти"
            placeholder="1"
            required
          />
          <Field
            name="comment"
            label="Коментар"
            placeholder="Введіть ваш коментар"
            wide
            textarea
          />
        </div>

        <button
          type="submit"
          className={styles.submit}
          disabled={mutation.isPending || items.length === 0}
        >
          {mutation.isPending ? <Loader size="sm" /> : 'Оформити замовлення'}
        </button>
      </Form>
    </Formik>
  );
}
