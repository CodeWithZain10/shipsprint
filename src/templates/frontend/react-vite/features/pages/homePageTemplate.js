const reactHomePageTemplate = () => {
return `import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Home() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Welcome to ShipSprint
      </h1>

      {isAuthenticated ? (
        <div className="flex gap-4">
          <Link to="/dashboard" className="bg-blue-600 text-white px-4 py-2 rounded-lg">
            Dashboard
          </Link>
        </div>
      ) : (
        <div className="flex gap-4">
          <Link to="/signin" className="bg-blue-600 text-white px-4 py-2 rounded-lg">
            Sign In
          </Link>
          <Link to="/signup" className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg">
            Sign Up
          </Link>
        </div>
      )}
    </div>
  );
}

export default Home;
`
}

export default reactHomePageTemplate