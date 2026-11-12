import axios from 'axios';

export function getAuthErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.code === 'ECONNABORTED' || error.response?.status === 504) {
      return 'Сервер не відповідає. Спробуйте ще раз пізніше.';
    }
    if (!error.response) {
      return 'Не вдалося з’єднатися із сервером. Перевірте інтернет-з’єднання.';
    }
    switch (error.response.status) {
      case 400:
      case 422:
        return 'Перевірте правильність введених даних.';
      case 401:
        return 'Неправильний номер телефону або пароль.';
      case 403:
        return 'Запит відхилено. Оновіть сторінку та спробуйте ще раз.';
      case 429:
        return 'Забагато спроб. Зачекайте та спробуйте ще раз.';
    }
  }
  return 'Не вдалося виконати запит. Спробуйте ще раз пізніше.';
}
