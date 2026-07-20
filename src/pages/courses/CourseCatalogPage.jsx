const courses = [
  { title: 'Ugali & kales', level: 'Beginner' },
  { title: 'Butter Chicken', level: 'Intermediate' },
  { title: 'Medium rare steak', level: 'Advanced' },
  { title: 'Medium rare steak', level: 'Advanced' },
  { title: 'Medium rare steak', level: 'Advanced' },
  { title: 'Medium rare steak', level: 'Advanced' }



];

function CourseCatalogPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 ">
        <h1 className="text-2xl font-semibold text-gray-900">Courses</h1>
        <p className="mt-2 text-sm text-gray-600">View our wide array of cooking courses tailored to your specific needs.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {courses.map((course) => (
          <div key={course.title} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-blue-600">{course.level}</p>
            <h2 className="mt-2 text-lg font-semibold text-gray-900">{course.title}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CourseCatalogPage;
