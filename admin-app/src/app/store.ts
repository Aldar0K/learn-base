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

// Base query на axios для поддержки cookies
const axiosBaseQuery: BaseQueryFn<
  BaseQueryArgs,
  unknown,
  BaseQueryError
> = async (args, api) => {
  try {
    const url = typeof args === "string" ? args : args.url;
    const method = typeof args === "string" ? "GET" : args.method || "GET";
    const data = typeof args === "string" ? undefined : args.data;
    const params = typeof args === "string" ? undefined : args.params;

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

    // При 401 (Unauthorized) очищаем user в auth slice
    if (status === 401) {
      const url = typeof args === "string" ? args : args.url;
      const normalizedUrl = url.startsWith("/") ? url : `/${url}`;
      const isMeRequest = normalizedUrl === "/auth/me";

      if (isMeRequest) {
        // Для /auth/me при 401 очищаем user в slice
        api.dispatch(authActions.setUser(null));
      }
    }

    return {
      error: {
        status,
        data: err.response?.data || err.message,
      },
    };
  }
};

// Base API с RTK Query
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery,
  tagTypes: ["User", "Course"],
  endpoints: () => ({}),
});
