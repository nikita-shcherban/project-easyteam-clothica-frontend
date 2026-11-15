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
