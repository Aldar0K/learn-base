import { baseApi } from "@/app/store";
import type { User } from "@/entities/user";
import { authActions } from "../model/auth.slice";

export type RegisterDto = {
  email: string;
  password: string;
};

export type LoginDto = {
  email: string;
  password: string;
};

export type AuthResponse = {
  user: User;
};

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<AuthResponse, RegisterDto>({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        data,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(authActions.setUser(data.user));
        } catch {
          // Игнорируем ошибки
        }
      },
    }),

    login: builder.mutation<AuthResponse, LoginDto>({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        data,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(authActions.setUser(data.user));
        } catch {
          // Игнорируем ошибки
        }
      },
    }),

    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(authActions.logout());
        } catch {
          dispatch(authActions.logout());
        }
      },
    }),

    getMe: builder.query<{ user: User }, void>({
      query: () => "/auth/me",
      providesTags: ["User"],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        dispatch(authActions.setLoading(true));
        try {
          const { data } = await queryFulfilled;
          dispatch(authActions.setUser(data.user));
        } catch (error) {
          // Если ошибка 401 и refresh не помог - очищаем user
          // Интерцептор уже попытался обновить токен
          const err = error as { status?: number };
          if (err.status === 401) {
            dispatch(authActions.setUser(null));
          }
        } finally {
          dispatch(authActions.setLoading(false));
        }
      },
    }),

    refresh: builder.mutation<AuthResponse, void>({
      query: () => ({
        url: "/auth/refresh",
        method: "POST",
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(authActions.setUser(data.user));
        } catch {
          // При ошибке refresh очищаем user
          dispatch(authActions.setUser(null));
        }
      },
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetMeQuery,
  useLazyGetMeQuery,
  useRefreshMutation,
} = authApi;
