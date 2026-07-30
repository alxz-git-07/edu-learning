import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { courseService } from '../../services/courseService';

function CourseCatalogPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadCourses() {
      try {
        const data = await courseService.getCourses();
        setCourses(data);
      } catch (err) {
        setError(err.message || 'Unable to load courses.');
      } finally {
        setLoading(false);
      }
    }

    void loadCourses();
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h1 className="text-2xl font-semibold text-gray-900">Courses</h1>
        <p className="mt-2 text-sm text-gray-600">Browse our wide array of get-go courses tailored to your specific needs.</p>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">Loading courses...</div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">{error}</div>
      ) : courses.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">No courses available.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {courses.map((course) => (
            <Link
              key={course.id}
              to={`/courses/${course.id}`}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <p className="text-sm font-medium text-blue-600">{course.level || 'Beginner'}</p>
              <h2 className="mt-2 text-lg font-semibold text-gray-900">{course.title}</h2>
              <p className="mt-3 text-sm text-gray-600 line-clamp-3">{course.description}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default CourseCatalogPage;
