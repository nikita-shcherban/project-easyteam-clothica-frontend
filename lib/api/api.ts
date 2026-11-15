import axios from 'axios';

// У браузері — той самий домен (/api → rewrite у next.config.ts), щоб не впиратися в CORS бекенду.
// На сервері — напряму до бекенду.
export const api = axios.create({
  baseURL:
    typeof window === 'undefined'
      ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api`
      : '/api',
  timeout: 20_000,
  withCredentials: true,
});
let refreshPromise: Promise<unknown> | null = null;
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      originalRequest.url?.includes('/auth/refresh') ||
      originalRequest.url?.includes('/auth/login') ||
      originalRequest.url?.includes('/auth/register')
    ) {
      return Promise.reject(error);
    }
    originalRequest._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = api.post('/auth/refresh').finally(() => {
          refreshPromise = null;
        });
      }

      await refreshPromise;
      return api(originalRequest);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  },
);
