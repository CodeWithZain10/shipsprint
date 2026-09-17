const reactAdminPageTemplate = () => {
return `import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const ROLES = ['user', 'admin'];

function Admin() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    api
      .get('/admin/users')
      .then((res) => setUsers(res.data.users))
      .catch((err) => toast.error(err.response?.data?.message || 'Failed to load users'))
      .finally(() => setLoading(false));
  }, []);

  const changeRole = async (id, role) => {
    setSavingId(id);
    try {
      const res = await api.patch(\`/admin/users/\${id}/role\`, { role });
      setUsers((prev) => prev.map((u) => (u._id === id ? res.data.user : u)));
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update role');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Admin · Users</h1>
        <Link to="/dashboard" className="text-blue-600 font-medium hover:underline">
          Back to dashboard
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-600">Loading users...</p>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3">Username</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-t border-gray-100">
                  <td className="px-4 py-3 text-gray-800">{u.username}</td>
                  <td className="px-4 py-3 text-gray-600">{u.email}</td>
                  <td className="px-4 py-3">
                    <select
                      aria-label={\`Role for \${u.email}\`}
                      value={u.role}
                      disabled={savingId === u._id || u._id === user?._id}
                      onChange={(e) => changeRole(u._id, e.target.value)}
                      className="border border-gray-300 rounded-lg px-2 py-1 disabled:opacity-50"
                    >
                      {ROLES.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                    {u._id === user?._id && <span className="ml-2 text-xs text-gray-400">(you)</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Admin;
`
}

export default reactAdminPageTemplate
