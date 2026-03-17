import axios from 'axios';

// ── Backend URL resolution ──────────────────────────────────────────
// Priority: VITE_API_URL env var  →  auto-detect prod vs dev
// Dev  (localhost)  : '/api'  →  Vite proxy forwards to localhost:3000
// Prod (Vercel etc) : hardcoded Render URL so it works without env var
const RENDER_BACKEND = 'https://triphub-backend-k9lv.onrender.com/api';

const isLocal =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' ||
   window.location.hostname === '127.0.0.1');

let baseURL = import.meta.env.VITE_API_URL || (isLocal ? '/api' : RENDER_BACKEND);
baseURL = baseURL.replace(/\/+$/, '');
if (!baseURL.endsWith('/api')) baseURL += '/api';

const api = axios.create({ baseURL });

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('triphub_token');
  if (token) config.headers.Authorization = 'Bearer ' + token;
  return config;
});

// On 401: clear auth and redirect to the correct login page
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
