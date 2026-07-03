import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

function Navbar() {
//   const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  // Navigation items
  const publicNavItems = [
    { label: 'Home', path: '/' },
    { label: 'Courses', path: '/courses'},
  ];

  const protectedNavItems = [
    { label: 'Dashboard', path: '/dashboard'},
    { label: 'Create Course', path: '/create-course'},
    { label: 'My Courses', path: '/my-courses'},
    { label: 'Assignments', path: '/assignments'},
  ];

  const bottomNavItems = [
    { label: 'Profile', path: '/profile'},
    { label: 'Settings', path: '/settings'},
  ];

  return (
    <aside className="fixed top-0 left-0 z-40 h-full w-64 bg-white border-r border-gray-200 shadow-lg mt-16">
      <div className="flex flex-col h-full">
        {/* User Profile */}
        {/* {isAuthenticated && (
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm">
                {user?.username?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user?.username}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email}
                </p>
              </div>
              <span className={`px-2 py-0.5 text-xs rounded-full ${
                user?.role === 'instructor' 
                  ? 'bg-purple-100 text-purple-700' 
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {user?.role === 'instructor' ? '👨‍🏫' : '🎓'}
              </span>
            </div>
          </div>
        )} */}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="px-3 space-y-1">
            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Main
            </p>
            
            {/* Public Navigation */}
            {publicNavItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  flex items-center space-x-3 px-3 py-2 rounded-lg
                  ${isActive 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                <span className="text-sm font-medium">{item.label}</span>
              </NavLink>
            ))}

            {isAuthenticated && (
              <>
                <div className="h-px bg-gray-200 my-3"></div>
                <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Learning
                </p>
                
                {/* Protected Navigation */}
                {protectedNavItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) => `
                      flex items-center space-x-3 px-3 py-2 rounded-lg
                      ${isActive 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'text-gray-700 hover:bg-gray-100'
                      }
                    `}
                  >
                    <span className="text-sm font-medium">{item.label}</span>
                  </NavLink>
                ))}
              </>
            )}

            <div className="h-px bg-gray-200 my-3"></div>
            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Account
            </p>

            {/* Bottom Navigation */}
            {isAuthenticated ? (
              <>
                {bottomNavItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) => `
                      flex items-center space-x-3 px-3 py-2 rounded-lg
                      ${isActive 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'text-gray-700 hover:bg-gray-100'
                      }
                    `}
                  >
                    <span className="text-sm font-medium">{item.label}</span>
                  </NavLink>
                ))}
                
                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 w-full"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) => `
                    flex items-center space-x-3 px-3 py-2 rounded-lg
                    ${isActive 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                  <span className="text-sm font-medium">Login</span>
                </NavLink>
                <NavLink
                  to="/register"
                  className={({ isActive }) => `
                    flex items-center space-x-3 px-3 py-2 rounded-lg
                    ${isActive 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <span className="text-sm font-medium">Sign Up</span>
                </NavLink>
              </>
            )}
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="bg-linear-to-r from-blue-500 to-purple-600 rounded-lg p-4 text-white">
            <p className="text-sm font-semibold"> EduLearning </p>
            <p className="text-xs opacity-80 mt-1">Learn. Connect. Grow.</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Navbar;
