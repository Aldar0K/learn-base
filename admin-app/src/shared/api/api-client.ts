import axios, { AxiosError, AxiosInstance } from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

// Создаем axios instance с настройками для работы с cookies
export const apiClient: AxiosInstance = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true, // Критически важно для отправки cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Интерцептор для обработки ошибок
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Неавторизован - можно перенаправить на страницу входа
      // Это будет обработано в auth context
    }
    return Promise.reject(error);
  }
);
