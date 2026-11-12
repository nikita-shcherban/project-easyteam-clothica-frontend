import axios, { AxiosError } from 'axios';

export type ApiError = AxiosError<{ error: string }>;

export const api = axios.create({
  baseURL: 'https://project-easyteam-2.onrender.com',
  withCredentials: true,
});
