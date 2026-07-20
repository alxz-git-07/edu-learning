import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function Topbar() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className="fixed inset-x-0 top-0 z-20 border-b border-gray-200 bg-amber-400 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="text-lg font-semibold tracking-tight text-gray-900">
          EduLearning
        </Link>
        <nav className="flex items-center gap-4 text-sm text-gray-600">
          <NavLink to="/courses" className="transition hover:text-blue-600">
            Courses
          </NavLink>
          {isAuthenticated ? (
            <>
              <NavLink to="/dashboard" className="transition hover:text-blue-600">
                Dashboard
              </NavLink>
              <button
                onClick={logout}
                className="rounded-lg border border-gray-300 px-3 py-2 font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Logout
              </button>
              <span className="text-gray-500">{user?.full_name || user?.username || 'Student'}</span>
            </>
          ) : (
            <>
              <NavLink to="/login" className="transition hover:text-blue-600">
                Login
              </NavLink>
              <NavLink to="/register" className="rounded-lg bg-blue-600 px-3 py-2 font-medium text-white transition hover:bg-blue-700">
                Join now
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Topbar;
