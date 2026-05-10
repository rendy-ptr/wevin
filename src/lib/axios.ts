import axios from 'axios';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL as string;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export default api;
