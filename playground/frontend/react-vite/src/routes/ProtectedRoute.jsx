import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children }) {
  const { isAuthenticated, authLoading } = useAuth();

 
  if (authLoading) {
    return (
       <div className="min-h-screen flex items-center justify-center">
      <div
        className="w-10 h-10 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"
        role="status"
        aria-label="Loading"
      />
    </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  return children;
}

export default ProtectedRoute;