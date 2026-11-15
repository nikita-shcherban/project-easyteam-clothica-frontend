'use client';

import { useId } from 'react';
import { useField } from 'formik';
import type {
  HTMLInputAutoCompleteAttribute,
  HTMLInputTypeAttribute,
  ReactNode,
} from 'react';
import styles from '@/components/LoginPage/LoginForm/LoginForm.module.css';

interface AuthFieldProps {
  name: string;
  label: string;
  id?: string;
  type?: HTMLInputTypeAttribute;
  autoComplete: HTMLInputAutoCompleteAttribute;
  placeholder: string;
  required?: boolean;
  validationAccessibility?: boolean;
  fieldClassName?: string;
  inputClassName?: string;
  invalidInputClassName?: string;
  inputWrapperClassName?: string;
  inputAdornment?: ReactNode;
  errorClassName?: string;
}

export default function AuthField({
  name,
  label,
  id: providedId,
  type,
  autoComplete,
  placeholder,
  required = true,
  validationAccessibility = true,
  fieldClassName = styles.field,
  inputClassName = styles.input,
  invalidInputClassName,
  inputWrapperClassName,
  inputAdornment,
  errorClassName = styles.error,
}: AuthFieldProps) {
  const generatedId = useId();
  const id = providedId ?? generatedId;
  const [field, meta] = useField<string>(name);
  const error = meta.touched ? meta.error : undefined;
  const input = (
    <input
      {...field}
      id={id}
      {...(type ? { type } : {})}
      autoComplete={autoComplete}
      placeholder={placeholder}
      required={required}
      aria-invalid={validationAccessibility ? Boolean(error) : undefined}
      aria-describedby={
        validationAccessibility && error ? `${id}-error` : undefined
      }
      className={
        error && invalidInputClassName
          ? `${invalidInputClassName} ${inputClassName}`.trim()
          : inputClassName
      }
    />
  );

  return (
    <div className={fieldClassName}>
      <label htmlFor={id}>{label}</label>
      {inputWrapperClassName ? (
        <div className={inputWrapperClassName}>
          {input}
          {inputAdornment}
        </div>
      ) : (
        input
      )}
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
