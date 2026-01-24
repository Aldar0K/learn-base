import { BrowserRouter, Route, Routes } from "react-router-dom";

import { AuthProvider } from "@/entities/auth";
import { CoursesPage } from "@/pages/courses-list";
import { CreateCoursePage } from "@/pages/create-course";
import { CreateUserPage } from "@/pages/create-user";
import { EditCoursePage } from "@/pages/edit-course";
import { HomePage } from "@/pages/home";
import { LoginPage } from "@/pages/login";
import { UsersPage } from "@/pages/users-list";
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
              <Route
                path="/users"
                element={
                  <ProtectedRoute>
                    <SuspenseWrapper>
                      <UsersPage />
                    </SuspenseWrapper>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/users/create"
                element={
                  <ProtectedRoute>
                    <SuspenseWrapper>
                      <CreateUserPage />
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
