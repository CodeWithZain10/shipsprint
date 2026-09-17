const reactAppTemplate = (answers) => {
const includeAuthentication = answers.includeBackend && answers.includeAuthentication

return `import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
${includeAuthentication ? `import Signin from './pages/auth/Signin';
import Signup from './pages/auth/Signup';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './routes/ProtectedRoute';` : ''}${answers.includeRBAC ? `
import Admin from './pages/Admin';` : ''}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />${includeAuthentication ? `
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />` : ''}${answers.includeRBAC ? `
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Admin />
          </ProtectedRoute>
        }
      />` : ''}
    </Routes>
  );
}

export default App;`
}

export default reactAppTemplate
