import { BrowserRouter, Route, Routes } from "react-router-dom";

import { AuthProvider } from "@/entities/auth";
import { HomePage } from "@/pages/home";
import { LoginPage } from "@/pages/login";
import { RegisterPage } from "@/pages/register";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { ProtectedRoute } from "./ProtectedRoute";
import { StoreProvider } from "./providers/StoreProvider";

const App = () => {
  return (
    <StoreProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        storageKey="learnbase-admin-theme"
        enableSystem={false}
      >
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <AuthProvider>
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
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </StoreProvider>
  );
};

export default App;
