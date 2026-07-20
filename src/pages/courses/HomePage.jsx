import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-gradient-to-r from-slate-900 to-blue-700 p-10 text-white shadow-sm">
        <p className="text-sm uppercase tracking-[0.3em] text-blue-100">EduLearning</p>
        <h1 className="mt-3 text-4xl font-semibold">Learn from expert-led courses built for real progress.</h1>
        <p className="mt-4 max-w-2xl text-lg text-blue-50">
          Discover practical lessons, track your growth, and grow your skills with a modern learning experience.
        </p>
        <div className="mt-6 flex gap-3">
          <Link to="/courses" className="rounded-lg bg-white px-4 py-2 font-medium text-blue-700">
            Browse courses
          </Link>
          <Link to="/register" className="rounded-lg border border-white/40 px-4 py-2 font-medium text-white">
            Create account
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {['Interactive lessons', 'Flexible learning paths', 'Progress tracking'].map((item) => (
          <div key={item} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900">{item}</h2>
            <p className="mt-2 text-sm text-gray-600">A polished experience for students and instructors alike.</p>
          </div>
        ))}
      </section>
    </div>
  );
}

export default HomePage;
