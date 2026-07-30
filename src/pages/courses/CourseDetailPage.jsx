import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { courseService } from '../../services/courseService';

function CourseDetailPage() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadCourse() {
      try {
        const courseData = await courseService.getCourse(id);
        setCourse(courseData);
        const [lessonsData, assignmentsData] = await Promise.all([
          courseService.getCourseLessons(id),
          courseService.getCourseAssignments(id),
        ]);
        setLessons(lessonsData);
        setAssignments(assignmentsData);
      } catch (err) {
        setError(err.message || 'Unable to load course details.');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      void loadCourse();
    }
  }, [id]);

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">Loading course details...</div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-red-700">{error}</div>
      ) : !course ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">Course not found.</div>
      ) : (
        <>
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-medium text-blue-600">Course #{course.id}</p>
            <h1 className="mt-2 text-2xl font-semibold text-gray-900">{course.title}</h1>
            <p className="mt-3 text-sm text-gray-600">{course.description}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Level</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{course.level || 'Beginner'}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Instructor</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{course.tm_user?.full_name || 'Unknown'}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">Lessons</h2>
              {lessons.length === 0 ? (
                <p className="mt-3 text-sm text-gray-600">No lessons published yet.</p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {lessons.map((lesson) => (
                    <li key={lesson.id} className="rounded-2xl border border-slate-200 p-4">
                      <p className="font-semibold text-slate-900">{lesson.title}</p>
                      <p className="mt-1 text-sm text-slate-600">{lesson.content || 'No description available.'}</p>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">Assignments</h2>
              {assignments.length === 0 ? (
                <p className="mt-3 text-sm text-gray-600">No assignments for this course yet.</p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {assignments.map((assignment) => (
                    <li key={assignment.id} className="rounded-2xl border border-slate-200 p-4">
                      <p className="font-semibold text-slate-900">{assignment.title}</p>
                      <p className="mt-1 text-sm text-slate-600">{assignment.description}</p>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </>
      )}

      <Link to="/courses" className="inline-flex text-xl font-medium text-blue-600">
        Back to catalog
      </Link>
    </div>
  );
}

export default CourseDetailPage;
