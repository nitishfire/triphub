import axios from 'axios';

//const api = axios.create({ baseURL: '/api', headers: { 'Content-Type': 'application/json' } });

// In dev: VITE_API_URL is unset → falls back to '/api' which Vite proxies to localhost:3000
// In prod: set VITE_API_URL to the Render backend URL, e.g. https://triphub-backend.onrender.com/api
let baseURL = import.meta.env.VITE_API_URL || '/api';
baseURL = baseURL.replace(/\/+$/, '');

// Ensure the /api suffix is present if the user forgot it in Vercel env vars
if (!baseURL.endsWith('/api')) baseURL += '/api';

const api = axios.create({ baseURL });


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
