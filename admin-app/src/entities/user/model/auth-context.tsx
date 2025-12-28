"use client";

import { useEffect, useState, type ReactNode } from "react";
import type { User } from "../types";
import { authApi } from "../api";
import { AuthContext } from "./auth-context.const";

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Проверяем текущего пользователя при загрузке
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { user } = await authApi.getMe();
        setUser(user);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const { user } = await authApi.login({ email, password });
    setUser(user);
  };

  const register = async (email: string, password: string) => {
    const { user } = await authApi.register({ email, password });
    setUser(user);
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Игнорируем ошибки при logout
    } finally {
      setUser(null);
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
