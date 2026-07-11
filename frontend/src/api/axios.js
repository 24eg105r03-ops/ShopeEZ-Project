import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const stored = localStorage.getItem('shopez_user');
  if (stored) {
    const { token } = JSON.parse(stored);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Dispatch global logout event when receiving a 401 Unauthorized response (e.g. database re-seeded)
      window.dispatchEvent(new CustomEvent('shopez-logout'));
    }
    return Promise.reject(error);
  }
);

export default api;
