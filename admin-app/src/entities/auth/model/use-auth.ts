import { useContext } from "react";
import { AuthContext } from "./auth-context.const";
import type { AuthContextType } from "./auth-context.types";

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
