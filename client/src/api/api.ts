import axios from 'axios';

const normalizeApiUrl = (url: string | undefined): string => {
  if (!url) {
    // Relative URL: Vite dev proxy forwards /api → localhost:5000
    return '/api';
  }

  let normalized = url.trim().replace(/\/+$/, '');

  try {
    const urlObj = new URL(normalized);
    const pathname = urlObj.pathname;

    if (pathname.includes('/api')) {
      return normalized;
    }

    if (pathname === '/' || pathname === '') {
      urlObj.pathname = '/api';
    } else {
      urlObj.pathname = pathname.endsWith('/')
        ? pathname + 'api'
        : pathname + '/api';
    }
    normalized = urlObj.toString().replace(/\/+$/, '');
  } catch {
    const urlPath = normalized.split('://')[1]?.split('/').slice(1).join('/') || '';

    if (urlPath.includes('/api') || normalized.includes('/api/')) {
      return normalized;
    }

    normalized = normalized + '/api';
  }

  try {
    new URL(normalized);
  } catch {
    console.warn('Invalid API URL format:', url, '— using /api');
    return '/api';
  }

  return normalized;
};

const API_URL = normalizeApiUrl(import.meta.env.VITE_API_URL);

if (import.meta.env.DEV) {
  console.log('API URL:', API_URL);
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('API Error Response:', {
        status: error.response.status,
        statusText: error.response.statusText,
        url: error.config?.url,
        message: error.response.data?.message || error.message,
      });
    } else if (error.request) {
      console.error('API Network Error:', {
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        message: error.message,
        code: error.code,
      });
    } else {
      console.error('API Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
