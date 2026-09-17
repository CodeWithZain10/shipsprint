const reactDashboardPageTemplate = (includeRBAC) => {
    return `import { ${includeRBAC ? 'Link, ' : ''}useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const { signout, user${includeRBAC ? ', hasRole' : ''} } = useAuth();
  const navigate = useNavigate();

  const handleSignout = async () => {
    await signout();
    navigate('/signin');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <div className="flex items-center gap-3">${includeRBAC ? `
          {hasRole('admin') && (
            <Link
              to="/admin"
              className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition"
            >
              Admin panel
            </Link>
          )}` : ''}
          <button
            onClick={handleSignout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </div>
      <p className="text-gray-600">Welcome{user?.username ? ', ' + user.username : ''}!</p>${includeRBAC ? `
      {user?.role && (
        <p className="mt-2 text-sm text-gray-500">
          Role: <span className="inline-block px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">{user.role}</span>
        </p>
      )}` : ''}
    </div>
  );
}

export default Dashboard;
`
}

export default reactDashboardPageTemplate
