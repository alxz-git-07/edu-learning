import { NavLink } from 'react-router-dom';

const links = [
  { to: '/dashboard', label: 'Overview' },
  { to: '/courses', label: 'Browse Courses' },
  { to: '/my-courses', label: 'My Courses' },
  { to: '/profile', label: 'Profile' },
  { to: '/settings', label: 'Settings' }
];

function Sidebar({ currentPath }) {
  return (
    <aside className="fixed left-0 top-16 z-10 hidden h-[calc(100vh-4rem)] w-64 border-r border-gray-200 bg-white px-5 py-6 lg:block">
      <div className="space-y-2">
        {links.map((link) => {
          const isActive = currentPath === link.to || currentPath.startsWith(link.to + '/');
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium transition ${
                isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {link.label}
            </NavLink>
          );
        })}
      </div>
    </aside>
  );
}

export default Sidebar;