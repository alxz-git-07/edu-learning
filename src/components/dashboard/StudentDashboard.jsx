const stats = [
  { label: 'Enrolled Courses', value: '6' },
  { label: 'Completed Lessons', value: '24' },
  { label: 'Weekly Focus', value: '4h' }
];

const courses = [
  { title: 'React for Beginners', progress: '72%' },
  { title: 'UI Design Systems', progress: '45%' },
  { title: 'Productivity Essentials', progress: '88%' }
];

function StudentDashboard() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-linear-to-r from-blue-600 to-blue-200 p-8 text-white shadow-sm">
        <p className="text-sm uppercase tracking-[0.3em] text-blue-100">Student overview</p>
        <h1 className="mt-2 text-3xl font-semibold">Keep your momentum going.</h1>
        <p className="mt-3 max-w-2xl text-blue-50">
          Your personalized learning dashboard is ready. Pick up where you left off and continue building real skills.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="mt-2 text-2xl font-semibold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Continue learning</h2>
          <a href="/courses" className="text-sm font-medium text-blue-600">View all</a>
        </div>
        <div className="space-y-4">
          {courses.map((course) => (
            <div key={course.title} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-medium text-gray-800">{course.title}</h3>
                <span className="text-sm text-gray-500">{course.progress}</span>
              </div>
              <div className="h-2 rounded-full bg-gray-200">
                <div className="h-2 rounded-full bg-blue-600" style={{ width: course.progress }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
