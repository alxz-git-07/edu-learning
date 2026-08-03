// import { useEffect, useState } from 'react';
// import { courseService } from '../../services/courseService';

// function MyCoursesPage() {
//   const [data, setData] = useState({ enrolled_courses: [], taught_courses: [] });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     async function loadMyCourses() {
//       try {
//         const response = await courseService.getMyCourses();
//         setData(response);
//       } catch (err) {
//         setError(err.message || 'Unable to load your courses.');
//       } finally {
//         setLoading(false);
//       }
//     }

//     void loadMyCourses();
//   }, []);

//   return (
//     <div className="space-y-6">
//       <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
//         <h1 className="text-2xl font-semibold text-gray-900">My courses</h1>
//         <p className="mt-2 text-sm text-gray-600">Your enrolled and created courses will be listed here.</p>
//       </div>

//       {loading ? (
//         <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">Loading your courses...</div>
//       ) : error ? (
//         <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-red-700">{error}</div>
//       ) : (
//         <div className="grid gap-4 xl:grid-cols-2">
//           <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
//             <h2 className="text-lg font-semibold text-gray-900">Enrolled Courses</h2>
//             {data.enrolled_courses.length === 0 ? (
//               <p className="mt-3 text-sm text-gray-600">You are not enrolled in any courses.</p>
//             ) : (
//               <ul className="mt-4 space-y-3">
//                 {data.enrolled_courses.map((course) => (
//                   <li key={course.id} className="rounded-2xl border border-slate-200 p-4">
//                     <p className="font-semibold text-slate-900">{course.title}</p>
//                     <p className="mt-1 text-sm text-slate-600">{course.description}</p>
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </section>

//           <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
//             <h2 className="text-lg font-semibold text-gray-900">Created Courses</h2>
//             {data.taught_courses.length === 0 ? (
//               <p className="mt-3 text-sm text-gray-600">You have not created any courses yet.</p>
//             ) : (
//               <ul className="mt-4 space-y-3">
//                 {data.taught_courses.map((course) => (
//                   <li key={course.id} className="rounded-2xl border border-slate-200 p-4">
//                     <p className="font-semibold text-slate-900">{course.title}</p>
//                     <p className="mt-1 text-sm text-slate-600">{course.description}</p>
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </section>
//         </div>
//       )}
//     </div>
//   );
// }

// export default MyCoursesPage;

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { courseService } from '../../services/courseService';

function MyCoursesPage() {
  const [data, setData] = useState({ enrolled_courses: [], taught_courses: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadMyCourses() {
      try {
        const response = await courseService.getMyCourses();
        setData(response);
      } catch (err) {
        setError(err.message || 'Unable to load your courses.');
      } finally {
        setLoading(false);
      }
    }

    void loadMyCourses();
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900">My courses</h1>
        <p className="mt-2 text-sm text-gray-600">Your enrolled and created courses will be listed here.</p>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">Loading your courses...</div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-red-700">{error}</div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Enrolled Courses</h2>
            {data.enrolled_courses.length === 0 ? (
              <p className="mt-3 text-sm text-gray-600">You are not enrolled in any courses.</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {data.enrolled_courses.map((course) => (
                  <li key={course.id} className="rounded-2xl border border-slate-200 p-0">
                    <Link
                      to={`/courses/${course.id}`}
                      className="block rounded-2xl p-4 hover:border-slate-300 hover:bg-slate-50 transition"
                    >
                      <p className="font-semibold text-slate-900">{course.title}</p>
                      <p className="mt-1 text-sm text-slate-600">{course.description}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Created Courses</h2>
            {data.taught_courses.length === 0 ? (
              <p className="mt-3 text-sm text-gray-600">You have not created any courses yet.</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {data.taught_courses.map((course) => (
                  <li key={course.id} className="rounded-2xl border border-slate-200 p-4">
                    <p className="font-semibold text-slate-900">{course.title}</p>
                    <p className="mt-1 text-sm text-slate-600">{course.description}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

export default MyCoursesPage;
