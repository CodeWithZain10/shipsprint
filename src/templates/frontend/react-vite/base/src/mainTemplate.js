const reactMainTemplate = (answers) => {
const includeAuthentication = answers.includeBackend && answers.includeAuthentication

return `import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
${includeAuthentication ? "import { AuthProvider } from './context/AuthContext.jsx'\n" : ""}import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>${includeAuthentication ? `
    <AuthProvider>
      <Toaster position='top-right' />
      <App />
      </AuthProvider>` : `
      <Toaster position='top-right' />
      <App />`}
    </BrowserRouter>
  </StrictMode>,
)
`
}

export default reactMainTemplate
