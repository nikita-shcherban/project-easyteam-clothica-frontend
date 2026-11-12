import axios from 'axios';

// Requests stay on the frontend origin; session cookies are HttpOnly.
export const api = axios.create({
  baseURL: '/api',
  timeout: 20_000,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});
