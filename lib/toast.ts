import axios from 'axios';

type ToastType = 'success' | 'error';

export async function showToast(type: ToastType, message: string) {
  // iziToast звертається до DOM — підвантажуємо лише в браузері
  const { default: iziToast } = await import('izitoast');
  iziToast[type]({
    title: type === 'success' ? 'Успіх' : 'Помилка',
    message,
    position: 'topRight',
    timeout: 5000,
    close: true,
    pauseOnHover: true,
  });
}

interface ServerError {
  message?: string;
  validation?: Record<string, { message?: string }>;
}

/** Текст помилки від сервера (http-errors або celebrate), або загальний */
export function getServerErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ServerError>(error)) {
    const data = error.response?.data;
    const validationMessage = data?.validation
      ? Object.values(data.validation)[0]?.message
      : undefined;
    if (validationMessage) return validationMessage;
    if (data?.message) return data.message;
    if (!error.response) {
      return 'Не вдалося з’єднатися із сервером. Перевірте інтернет-з’єднання.';
    }
  }
  return 'Не вдалося виконати запит. Спробуйте ще раз пізніше.';
}
