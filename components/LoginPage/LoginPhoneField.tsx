'use client';

import { useId, useState } from 'react';
import { useField } from 'formik';
import { IMaskInput } from 'react-imask';
import type { HTMLInputAutoCompleteAttribute } from 'react';
import styles from './LoginPhoneField.module.css';

interface LoginPhoneFieldProps {
  id?: string;
  autoComplete?: HTMLInputAutoCompleteAttribute;
  placeholder?: string;
  fieldClassName?: string;
  inputClassName?: string;
  invalidInputClassName?: string;
  errorClassName?: string;
  required?: boolean;
  validationAccessibility?: boolean;
}

export default function LoginPhoneField({
  id: providedId,
  autoComplete = 'username',
  placeholder = '+38 (0__) __-__-__',
  fieldClassName = styles.field,
  inputClassName = styles.input,
  invalidInputClassName,
  errorClassName = styles.error,
  required = true,
  validationAccessibility = true,
}: LoginPhoneFieldProps = {}) {
  const generatedId = useId();
  const id = providedId ?? generatedId;
  const [field, meta, helpers] = useField<string>('phone');
  const error = meta.touched ? meta.error : undefined;
  const className =
    error && invalidInputClassName
      ? inputClassName
        ? `${invalidInputClassName} ${inputClassName}`
        : invalidInputClassName
      : inputClassName;

  return (
    <div className={fieldClassName}>
      <label htmlFor={id}>
        Номер телефону<span aria-hidden="true">*</span>
      </label>
      <IMaskInput
        id={id}
        name={field.name}
        type="text"
        inputMode="tel"
        autoComplete={autoComplete}
        mask={'+{38} (\\000) 000-00-00'}
        lazy={false}
        overwrite
        value={field.value}
        onAccept={(value) => {
          const nextValue = value.replace(/\D/g, '').length > 3 ? value : '';
          if (nextValue !== field.value) void helpers.setValue(nextValue);
        }}
        onInput={(e) => togglePlaceholderColor((e.target as any).value)}
        onBlur={field.onBlur}
        onPaste={(event) => {
          const digits = event.clipboardData.getData('text').replace(/\D/g, '');
          // Accept full national and international numbers from the clipboard.
          if (/^0\d{9}$/.test(digits) || /^380\d{9}$/.test(digits)) {
            event.preventDefault();
            void helpers.setValue(
              `+${digits.length === 10 ? '38' : ''}${digits}`,
            );
          }
        }}
        placeholder={placeholder}
        required={required}
        aria-invalid={validationAccessibility ? Boolean(error) : undefined}
        aria-describedby={
          validationAccessibility && error ? `${id}-error` : undefined
        }
        className={`${styles.input}`}
      />
      {error && (
        <p
          id={validationAccessibility ? `${id}-error` : undefined}
          className={errorClassName}
        >
          {error}
        </p>
      )}
    </div>
  );
}
