import axios from 'axios';

// Requests go directly to the backend; session cookies are included.
export const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api`,
  timeout: 20_000,
  withCredentials: true,
});
