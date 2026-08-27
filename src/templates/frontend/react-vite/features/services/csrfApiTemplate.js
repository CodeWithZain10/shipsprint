const reactCsrfApiTemplate = () => {
    return `
    import api from './api';

export async function initCsrf() {
  try {
    await api.get('/auth/csrf');
  } catch (err) {
    console.error('Failed to initialize CSRF token', err);
  }
}
    `
}

export default reactCsrfApiTemplate;