import { useParams } from 'react-router-dom';

function LessonPage() {
  const { id } = useParams();

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-semibold text-gray-900">Lesson {id}</h1>
      <p className="mt-2 text-sm text-gray-600">Lesson content will be rendered here once the content pipeline is connected.</p>
    </div>
  );
}

export default LessonPage;
