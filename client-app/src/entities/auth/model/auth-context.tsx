"use client";

import type { User } from "@/entities/user";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import {
  useLoginMutation,
  useLazyGetMeQuery,
  useLogoutMutation,
  useRegisterMutation,
} from "../api/auth.api";
import { AuthContext } from "./auth-context.const";

type AuthProviderProps = {
  children: ReactNode;
  initialUser?: User | null;
};

export const AuthProvider = ({ children, initialUser = null }: AuthProviderProps) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(initialUser);
  const [isLoading, setIsLoading] = useState(false);

  const [loginMutation] = useLoginMutation();
  const [registerMutation] = useRegisterMutation();
  const [logoutMutation] = useLogoutMutation();
  const [getMe] = useLazyGetMeQuery();

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const data = await loginMutation({ email, password }).unwrap();
      setUser(data.user);
      router.replace("/");
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const data = await registerMutation({ email, password }).unwrap();
      setUser(data.user);
      router.replace("/");
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await logoutMutation().unwrap();
    } catch {
      // Игнорируем ошибки при logout
    } finally {
      setUser(null);
      setIsLoading(false);
      router.replace("/login");
      router.refresh();
    }
  };

  const refetchMe = async () => {
    setIsLoading(true);
    try {
      const data = await getMe().unwrap();
      setUser(data.user);
      return data.user;
    } catch {
      setUser(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        refetchMe,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
