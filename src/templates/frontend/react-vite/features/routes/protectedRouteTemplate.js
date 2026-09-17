const reactProtectedRouteTemplate = (includeRBAC) => {
return `import { ${includeRBAC ? 'Link, ' : ''}Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children${includeRBAC ? ', allowedRoles' : ''} }) {
  const { isAuthenticated, authLoading${includeRBAC ? ', user' : ''} } = useAuth();


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
${includeRBAC ? `
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-gray-100 px-4">
        <h1 className="text-3xl font-bold text-gray-800">403</h1>
        <p className="text-gray-600">You do not have permission to view this page.</p>
        <Link to="/dashboard" className="text-blue-600 font-medium hover:underline">
          Back to dashboard
        </Link>
      </div>
    );
  }
` : ''}
  return children;
}

export default ProtectedRoute;`
}

export default reactProtectedRouteTemplate
