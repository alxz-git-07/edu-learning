const cards = [
  { label: 'Courses Published', value: '8' },
  { label: 'Active Students', value: '142' },
  { label: 'Average Rating', value: '4.9/5' }
];

function InstructorDashboard() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-blue-600 p-8 text-white shadow-sm">
        <p className="text-sm uppercase tracking-[0.3em] text-emerald-100">Instructor overview</p>
        <h1 className="mt-2 text-3xl font-semibold">“A teacher affects eternity; he can never tell where his influence stops.” – Henry Adams
.</h1>
        <p className="mt-3 max-w-2xl text-emerald-50">
          Create new lessons, grade your learners and impact their learning journey.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <div key={card.label} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">{card.label}</p>
            <p className="mt-2 text-2xl font-semibold text-gray-900">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">What’s next</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-gray-600">
          <li>Publish a new lesson.</li>
          <li>Review learner feedback .</li>
          <li>Grade submitted assignments.</li>
        </ul>
      </div>
    </div>
  );
}

export default InstructorDashboard;
