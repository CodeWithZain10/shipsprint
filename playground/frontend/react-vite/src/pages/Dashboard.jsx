import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const { signout, user } = useAuth();
  const navigate = useNavigate();

  const handleSignout = async () => {
    await signout();
    navigate('/signin');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <button
          onClick={handleSignout}
          className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
      <p className="text-gray-600">Welcome{user?.username ? `, ${user.username}` : ''}!</p>
    </div>
  );
}

export default Dashboard;