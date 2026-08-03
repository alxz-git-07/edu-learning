import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import { adminService } from '../../services/adminService';

function AdminDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    async function loadUsers() {
      try {
        const data = await adminService.getUsers();
        setUsers(data);
      } catch (err) {
        setError(err.message || 'Unable to load users.');
      } finally {
        setLoading(false);
      }
    }

    if (user?.role === 'admin') {
      void loadUsers();
    }
  }, [user]);

  if (authLoading) {
    return <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">Loading session...</div>;
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleDeleteUser(userId) {
    const confirmed = window.confirm('Are you sure you want to delete this user?');
    if (!confirmed) return;

    setDeletingId(userId);
    try {
      await adminService.deleteUser(userId);
      setUsers((current) => current.filter((item) => item.id !== userId));
      toast.success('User deleted successfully.');
    } catch (err) {
      const message = err.message || 'Unable to delete user.';
      toast.error(message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">Manage platform users from this secured admin area.</p>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">Loading users...</div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-red-700">{error}</div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Role</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {users.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.full_name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.email}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.role}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.is_active ? 'Active' : 'Inactive'}</td>
                    <td className="px-4 py-3 text-sm">
                      <button
                        type="button"
                        onClick={() => void handleDeleteUser(item.id)}
                        disabled={deletingId === item.id}
                        className="rounded-lg bg-red-600 px-3 py-2 font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
                      >
                        {deletingId === item.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboardPage;
