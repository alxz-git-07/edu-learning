// src/AppRoutes.jsx
import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import ProtectedRoute from './components/common/ProtectedRoute';
import Sidebar from './components/common/Sidebar';
import Footer from './components/common/Footer';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';

// Public Pages
import HomePage from './pages/courses/HomePage';
import CourseCatalogPage from './pages/courses/CourseCatalogPage';
import CourseDetailPage from './pages/courses/CourseDetailPage';

// Protected Pages
import DashboardPage from './pages/dashboard/DashboardPage';
import CreateCoursePage from './pages/courses/CreateCoursePage';
import LessonPage from './pages/lessons/LessonPage';
import AssignmentPage from './pages/assignments/AssignmentPage';
import ProfilePage from './pages/profile/ProfilePage';
import MyCoursesPage from './pages/courses/MyCoursesPage';
import SettingsPage from './pages/settings/SettingsPage';
import NotFound from './pages/NotFound';

function AppRoutes() {
  // Get current location for sidebar highlighting
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Bar - Always visible */}
      <Topbar />

      <div className="flex flex-1">
        {/* Sidebar - Receives current path */}
        <Sidebar currentPath={currentPath} />

        {/* Main Content Area */}
        <main className="flex-1 ml-64 mt-16">
          <div className="p-6">
            <Routes>
              {/* ===== PUBLIC ROUTES ===== */}
              <Route path="/" element={<HomePage />} />
              <Route path="/courses" element={<CourseCatalogPage />} />
              <Route path="/courses/:id" element={<CourseDetailPage />} />
              
              {/* Auth Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />

              {/* ===== PROTECTED ROUTES (5+ Routes) ===== */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create-course"
                element={
                  <ProtectedRoute>
                    <CreateCoursePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-courses"
                element={
                  <ProtectedRoute>
                    <MyCoursesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/lessons/:id"
                element={
                  <ProtectedRoute>
                    <LessonPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/assignments"
                element={
                  <ProtectedRoute>
                    <AssignmentPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/assignments/:id"
                element={
                  <ProtectedRoute>
                    <AssignmentPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <SettingsPage />
                  </ProtectedRoute>
                }
              />

              {/* 404 Route */}
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" />} />
            </Routes>
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}

export default AppRoutes;