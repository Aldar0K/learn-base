import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";
import type { AxiosError, AxiosRequestConfig } from "axios";

import { authActions } from "@/entities/auth";
import { apiClient } from "@/shared/api";

type BaseQueryArgs =
  | string
  | {
      url: string;
      method?: AxiosRequestConfig["method"];
      data?: unknown;
      params?: unknown;
    };

type BaseQueryError = {
  status: number;
  data: unknown;
};

let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

const refreshToken = async (): Promise<void> => {
  await apiClient.post("/auth/refresh");
};

// Base query на axios для поддержки cookies с автоматическим refresh
const axiosBaseQuery: BaseQueryFn<
  BaseQueryArgs,
  unknown,
  BaseQueryError
> = async (args, api, extraOptions) => {
  const url = typeof args === "string" ? args : args.url;
  const method = typeof args === "string" ? "GET" : args.method || "GET";
  const data = typeof args === "string" ? undefined : args.data;
  const params = typeof args === "string" ? undefined : args.params;

  const makeRequest = async () => {
    try {
      const result = await apiClient({
        url: url.startsWith("/") ? url : `/${url}`,
        method,
        data,
        params,
      });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError<{ message?: string }>;
      const status = err.response?.status || 500;

      // При 401 пытаемся обновить токен (кроме запроса на refresh)
      if (status === 401 && url !== "/auth/refresh") {
        // Если уже идет refresh - ждем его завершения
        if (isRefreshing && refreshPromise) {
          await refreshPromise;
          // Повторяем запрос после refresh
          try {
            const retryResult = await apiClient({
              url: url.startsWith("/") ? url : `/${url}`,
              method,
              data,
              params,
            });
            return { data: retryResult.data };
          } catch (retryError) {
            const retryErr = retryError as AxiosError;
            return {
              error: {
                status: retryErr.response?.status || 500,
                data: retryErr.response?.data || retryErr.message,
              },
            };
          }
        }

        // Запускаем refresh
        if (!isRefreshing) {
          isRefreshing = true;
          refreshPromise = refreshToken()
            .then(() => {
              isRefreshing = false;
              refreshPromise = null;
            })
            .catch((refreshError) => {
              isRefreshing = false;
              refreshPromise = null;
              // Если refresh не удался - очищаем user
              if (url === "/auth/me") {
                api.dispatch(authActions.setUser(null));
              }
              throw refreshError;
            });

          await refreshPromise;

          // Повторяем оригинальный запрос
          try {
            const retryResult = await apiClient({
              url: url.startsWith("/") ? url : `/${url}`,
              method,
              data,
              params,
            });
            return { data: retryResult.data };
          } catch (retryError) {
            const retryErr = retryError as AxiosError;
            return {
              error: {
                status: retryErr.response?.status || 500,
                data: retryErr.response?.data || retryErr.message,
              },
            };
          }
        }
      }

      // Для /auth/refresh при 401 очищаем user (refresh token истек)
      if (status === 401 && url === "/auth/refresh") {
        api.dispatch(authActions.setUser(null));
      }

      return {
        error: {
          status,
          data: err.response?.data || err.message,
        },
      };
    }
  };

  return makeRequest();
};

// Base API с RTK Query (готов к SSR)
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery,
  tagTypes: ["User", "Course"],
  extractRehydrationInfo(action, { reducerPath }) {
    // Для будущей регидратации при SSR
    if (action.type === "HYDRATE") {
      const payload = action.payload as Record<string, unknown>;
      return payload[reducerPath] as
        | import("@reduxjs/toolkit/query").CombinedState<
            {},
            "User" | "Course",
            "api"
          >
        | undefined;
    }
    return undefined;
  },
  endpoints: () => ({}),
});
