import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Create an axios instance
const client = axios.create({
  baseURL: API_URL
});

export default client;

// Add request interceptor to include auth token
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor: on 401/403 clear auth and redirect to login
client.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('tokenExpiration');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
); 