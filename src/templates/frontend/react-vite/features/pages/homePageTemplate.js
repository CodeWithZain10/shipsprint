const reactHomePageTemplate = (answers) => {
const includeAuthentication = answers.includeBackend && answers.includeAuthentication

return `${includeAuthentication ? "import { Link } from 'react-router-dom';\nimport { useAuth } from '../context/AuthContext';\n" : ""}import SystemStatus from '../components/SystemStatus';

function Home() {
${includeAuthentication ? "  const { isAuthenticated } = useAuth();\n" : ""}
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-gray-100 px-4">
      <h1 className="text-3xl font-bold text-gray-800">
        Welcome to ShipSprint
      </h1>
${includeAuthentication ? `
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
` : ""}
      <SystemStatus />
    </div>
  );
}

export default Home;
`
}

export default reactHomePageTemplate
