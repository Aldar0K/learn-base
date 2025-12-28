import { BrowserRouter, Route, Routes } from "react-router-dom";

import { AuthProvider } from "@/entities/user";
import { HomePage } from "@/pages/home";
import { LoginPage } from "@/pages/login";
import { RegisterPage } from "@/pages/register";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { ProtectedRoute } from "./ProtectedRoute";

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
