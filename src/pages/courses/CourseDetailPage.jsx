import { useParams, Link } from 'react-router-dom';

function CourseDetailPage() {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-medium text-blue-600">Course #{id}</p>
        <h1 className="mt-2 text-2xl font-semibold text-gray-900">Course overview</h1>
        <p className="mt-3 text-sm text-gray-600">Detailed lesson content and enrollment actions will appear here.</p>
        <Link to="/courses" className="mt-6 inline-flex text-sm font-medium text-blue-600">
          ← Back to catalog
        </Link>
      </div>
    </div>
  );
}

export default CourseDetailPage;
