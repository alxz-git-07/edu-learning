import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
      <div className="text-center">
        <p className="text-sm font-medium text-blue-600">404</p>
        <h1 className="mt-2 text-3xl font-semibold text-gray-900">Page not found</h1>
        <p className="mt-3 text-sm text-gray-600">The page you requested could not be found.</p>
        <Link to="/" className="mt-6 inline-flex rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700">
          Go home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
