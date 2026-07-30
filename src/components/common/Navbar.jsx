import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
function Navbar() {
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  const publicNavItems = [
    { label: 'Home', path: '/' },
    { label: 'Courses', path: '/courses' }
  ];

  const protectedNavItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Create Course', path: '/create-course' },
    { label: 'My Courses', path: '/my-courses' },
    { label: 'Assignments', path: '/assignments' }
  ];

  const bottomNavItems = [
    { label: 'Profile', path: '/profile' },
    { label: 'Settings', path: '/settings' }
  ];

  return (
    <aside className="fixed left-0 top-16 z-40 h-full w-64 border-r border-gray-200 bg-white shadow-lg">
      <div className="flex h-full flex-col">
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="space-y-1 px-3">
            <p className="px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Main</p>
            {publicNavItems.map((item) => (
              <NavLink key={item.path} to={item.path} className={({ isActive }) => `block rounded-lg px-3 py-2 text-sm font-medium ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}>
                {item.label}
              </NavLink>
            ))}

            {isAuthenticated && (
              <>
                <div className="my-3 h-px bg-gray-200" />
                <p className="px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Learning</p>
                {protectedNavItems.map((item) => (
                  <NavLink key={item.path} to={item.path} className={({ isActive }) => `block rounded-lg px-3 py-2 text-sm font-medium ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}>
                    {item.label}
                  </NavLink>
                ))}
              </>
            )}

            <div className="my-3 h-px bg-gray-200" />
            <p className="px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Account</p>
            {isAuthenticated ? (
              <>
                {bottomNavItems.map((item) => (
                  <NavLink key={item.path} to={item.path} className={({ isActive }) => `block rounded-lg px-3 py-2 text-sm font-medium ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}>
                    {item.label}
                  </NavLink>
                ))}
                <button onClick={handleLogout} className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50">
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={({ isActive }) => `block rounded-lg px-3 py-2 text-sm font-medium ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}>
                  Login
                </NavLink>
                <NavLink to="/register" className={({ isActive }) => `block rounded-lg px-3 py-2 text-sm font-medium ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}>
                  Sign Up
                </NavLink>
              </>
            )}
          </div>
        </nav>

        <div className="border-t border-gray-200 p-4">
          <div className="rounded-lg bg-linear-to-r from-blue-500 to-purple-600 p-4 text-white">
            <p className="text-sm font-semibold">EduLearning</p>
            <p className="mt-1 text-xs opacity-80">Learn. Connect. Grow.</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Navbar;
