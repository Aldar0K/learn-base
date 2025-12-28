import { type ReactNode } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { ThemeProvider } from "@/providers/ThemeProvider";
import { AuthProvider, useAuth } from "@/entities/user";
import { Header } from "@/widgets/header";
import { LoginPage } from "@/pages/login";
import { RegisterPage } from "@/pages/register";

// Защищенный роут
const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

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

  return <>{children}</>;
};

// Главная страница (защищенная)
const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 flex">
        <div className="flex-1 flex flex-col justify-center items-center gap-2">
          <h1 className="text-2xl font-bold">LearnBase Admin</h1>
          <p className="text-muted-foreground">
            Welcome, {user?.email} ({user?.role})
          </p>
        </div>
      </main>
    </div>
  );
};

const App = () => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      storageKey="learnbase-admin-theme"
      enableSystem={false}
    >
      <AuthProvider>
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
