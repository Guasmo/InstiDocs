import React, { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext.tsx";
import { DocumentProvider } from "./context/DocumentContext.tsx";
import { UserProvider } from "./context/UserContext.tsx";
import Layout from "./components/Principal/Layout.tsx";
import ProtectedRoute from "./components/Auth/ProtectedRoute.tsx";
import { Login } from "./pages/login.tsx";
import { Register } from "./pages/register.tsx";
import { MisDocumentos } from "./pages/documents.tsx";
import LoadingFallback from "./components/shared/Loading.tsx";

const Dashboard = lazy(() => import("./pages/dashboard"));
const Profile = lazy(() => import("./pages/profile"));
const CoursesPage = lazy(() => import("./pages/CoursesPage"));
const CourseDetailsPage = lazy(() => import("./pages/CourseDetailsPage"));
const CreateCoursePage = lazy(() => import("./pages/CreateCoursePage"));

const App: React.FC = () => {
  return (
    <AuthProvider>
      <UserProvider>
        <DocumentProvider>
          <BrowserRouter>
            <Suspense fallback={<LoadingFallback fullscreen={true} />}>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/mis-documentos" element={<MisDocumentos />} />
                  <Route path="/perfil" element={<Profile />} />
                  <Route path="/courses" element={<CoursesPage />} />
                  <Route path="/courses/:id" element={<CourseDetailsPage />} />
                  <Route path="/create-course" element={<CreateCoursePage />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </DocumentProvider>
      </UserProvider>
    </AuthProvider>
  );
};

export default App;