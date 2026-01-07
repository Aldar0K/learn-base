import axios, { AxiosInstance } from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

// Создаем axios instance с настройками для работы с cookies
export const apiClient: AxiosInstance = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true, // Критически важно для отправки cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Базовый интерцептор удален - вся логика обработки ошибок в store.ts (baseQuery)
