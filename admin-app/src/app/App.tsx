import { BrowserRouter, Route, Routes } from "react-router-dom";

import { AuthProvider } from "@/entities/auth";
import { CoursesPage } from "@/pages/courses-list";
import { CreateCoursePage } from "@/pages/create-course";
import { EditCoursePage } from "@/pages/edit-course";
import { HomePage } from "@/pages/home";
import { LoginPage } from "@/pages/login";
import { RegisterPage } from "@/pages/register";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { SuspenseWrapper } from "@/shared/ui";
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
              <Route
                path="/login"
                element={
                  <SuspenseWrapper>
                    <LoginPage />
                  </SuspenseWrapper>
                }
              />
              <Route
                path="/register"
                element={
                  <SuspenseWrapper>
                    <RegisterPage />
                  </SuspenseWrapper>
                }
              />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <SuspenseWrapper>
                      <HomePage />
                    </SuspenseWrapper>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/courses"
                element={
                  <ProtectedRoute>
                    <SuspenseWrapper>
                      <CoursesPage />
                    </SuspenseWrapper>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/courses/create"
                element={
                  <ProtectedRoute>
                    <SuspenseWrapper>
                      <CreateCoursePage />
                    </SuspenseWrapper>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/courses/:id"
                element={
                  <ProtectedRoute>
                    <SuspenseWrapper>
                      <EditCoursePage />
                    </SuspenseWrapper>
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
