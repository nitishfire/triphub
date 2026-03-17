import axios from 'axios';

//const api = axios.create({ baseURL: '/api', headers: { 'Content-Type': 'application/json' } });

// Clean the base URL by removing any trailing slashes to prevent double-slash routing issues
let baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
baseURL = baseURL.replace(/\/+$/, '');

// Ensure the api suffix is present if the user forgot it in Vercel
const api = axios.create({
  baseURL: baseURL.endsWith('/api') ? baseURL : (baseURL + '/api')
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem('triphub_token');
  if (token) config.headers.Authorization = 'Bearer ' + token;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      const saved = localStorage.getItem('triphub_user');
      const user = saved ? JSON.parse(saved) : null;
      localStorage.removeItem('triphub_token');
      localStorage.removeItem('triphub_user');
      window.location.href = user?.type === 'hotel' ? '/hotel/login' : '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
