import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import ProtectedRoute from './components/common/ProtectedRoute';
import Sidebar from './components/common/Sidebar';
import Topbar from './components/common/Topbar';
import Footer from './components/common/Footer';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import HomePage from './pages/courses/HomePage';
import CourseCatalogPage from './pages/courses/CourseCatalogPage';
import CourseDetailPage from './pages/courses/CourseDetailPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import CreateCoursePage from './pages/courses/CreateCoursePage';
import LessonPage from './pages/lessons/LessonPage';
import AssignmentPage from './pages/assignments/AssignmentPage';
import ProfilePage from './pages/profile/ProfilePage';
import MyCoursesPage from './pages/courses/MyCoursesPage';
import SettingsPage from './pages/settings/SettingsPage';
import NotFound from './pages/NotFound';

function AppRoutes() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Topbar />

      <div className="flex flex-1">
        <Sidebar currentPath={currentPath} />

        <main className="ml-64 mt-16 flex-1">
          <div className="p-6">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/courses" element={<CourseCatalogPage />} />
              <Route path="/courses/:id" element={<CourseDetailPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
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