import { useAuth } from "@/entities/auth";
import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";

type ProtectedRouteProps = {
  children: ReactNode;
};

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Admin-app доступен только авторам и админам
  if (user?.role !== "author" && user?.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
