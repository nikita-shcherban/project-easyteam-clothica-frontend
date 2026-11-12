import axios from 'axios';

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';
export const api = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
});
