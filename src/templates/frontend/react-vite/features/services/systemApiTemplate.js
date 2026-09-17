const reactSystemApiTemplate = () => {
return `import axios from 'axios';

// Auth routes live under /api, while /health, /version and /api-info live at the server root
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const system = axios.create({
  baseURL: apiUrl.replace(/[/]api[/]?$/, ''),
  // /health answers 503 when the database is down; we still want to read that body
  validateStatus: (status) => status < 600,
});

export const getHealth = () => system.get('/health').then((res) => res.data);
export const getVersion = () => system.get('/version').then((res) => res.data);
export const getApiInfo = () => system.get('/api-info').then((res) => res.data);
`
}

export default reactSystemApiTemplate
