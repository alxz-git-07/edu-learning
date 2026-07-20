import { useAuth } from '../../contexts/AuthContext';
import StudentDashboard from '../../components/dashboard/StudentDashboard';
import InstructorDashboard from '../../components/dashboard/InstructorDashboard';

function DashboardPage() {
  const { user } = useAuth();
  const role = user?.role || 'user';

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-blue-600">Welcome back</p>
        <h1 className="mt-2 text-2xl font-semibold text-gray-900">
          {user?.full_name || user?.username || 'Learner'}
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Here is your learning hub for today. Track your progress and jump into the next lesson.
        </p>
      </div>

      {role === 'instructor' ? <InstructorDashboard /> : <StudentDashboard />}
    </div>
  );
}

export default DashboardPage;
