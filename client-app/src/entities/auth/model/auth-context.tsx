"use client";

import type { User } from "@/entities/user";
import { useEffect, type ReactNode } from "react";
import { useSelector } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import {
  useGetMeQuery,
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
} from "../api/auth.api";
import { AuthContext } from "./auth-context.const";

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useSelector(
    (state: { auth: { user: User | null; isLoading: boolean } }) => state.auth
  );

  // Используем isLoading из RTK Query для более точного отслеживания состояния загрузки
  const { isLoading: isGetMeLoading } = useGetMeQuery();
  const { isLoading: isLoadingFromSlice } = useSelector(
    (state: { auth: { user: User | null; isLoading: boolean } }) => state.auth
  );

  // isLoading = true если идет запрос getMe ИЛИ если в slice установлен loading
  const isLoading = isGetMeLoading || isLoadingFromSlice;

  const [loginMutation] = useLoginMutation();
  const [registerMutation] = useRegisterMutation();
  const [logoutMutation] = useLogoutMutation();

  const isAuthPage = pathname === "/login" || pathname === "/register";

  // Автоматическая навигация на основе состояния авторизации
  useEffect(() => {
    // Не навигируем пока идет загрузка, чтобы избежать проскакивания login page
    if (isLoading) return;

    if (!user && !isAuthPage) {
      router.push("/login");
    } else if (user && isAuthPage) {
      router.push("/");
    }
  }, [user, isLoading, isAuthPage, router]);

  const login = async (email: string, password: string) => {
    await loginMutation({ email, password }).unwrap();
  };

  const register = async (email: string, password: string) => {
    await registerMutation({ email, password }).unwrap();
  };

  const logout = async () => {
    try {
      await logoutMutation().unwrap();
    } catch {
      // Игнорируем ошибки при logout
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
