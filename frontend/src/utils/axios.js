import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

// Use environment variable for API URL, fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add interceptors for logging (only in development)
if (import.meta.env.DEV) {
  api.interceptors.request.use(
    config => {
      console.log('Making API request to:', config.baseURL + config.url);
      console.log('Request config:', {
        method: config.method,
        headers: config.headers,
        data: config.data
      });
      return config;
    },
    error => {
      console.error('API request error:', error);
      return Promise.reject(error);
    }
  );
}

// Create a function to get the token
export const getApiWithToken = async () => {
  try {
    if (import.meta.env.DEV) {
      console.log('Attempting to get Clerk session token...');
    }

    // Try different methods to get the Clerk token
    let token = null;

    // Method 1: Using window.Clerk directly
    if (window.Clerk?.session) {
      try {
        token = await window.Clerk.session.getToken();
        if (import.meta.env.DEV) {
          console.log('Got token from window.Clerk.session');
        }
      } catch (err) {
        if (import.meta.env.DEV) {
          console.error('Error getting token from window.Clerk.session:', err);
        }
      }
    }

    // Method 2: Using localStorage (if Clerk stores token there)
    if (!token && localStorage.getItem('__clerk_client_jwt')) {
      token = localStorage.getItem('__clerk_client_jwt');
      if (import.meta.env.DEV) {
        console.log('Got token from localStorage');
      }
    }

    // Method 3: If user is already logged in to Clerk
    if (!token && window.Clerk?.user) {
      try {
        token = await window.Clerk.user.getToken();
        if (import.meta.env.DEV) {
          console.log('Got token from window.Clerk.user');
        }
      } catch (err) {
        if (import.meta.env.DEV) {
          console.error('Error getting token from window.Clerk.user:', err);
        }
      }
    }

    if (import.meta.env.DEV) {
      console.log('Token obtained:', token ? 'Yes (first 10 chars: ' + token.substring(0, 10) + '...)' : 'No token received');
    }

    // Clone the api instance
    const authenticatedApi = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      }
    });

    // Add the same logging interceptors for development
    if (import.meta.env.DEV) {
      authenticatedApi.interceptors.request.use(
        config => {
          console.log('Making authenticated API request to:', config.baseURL + config.url);
          console.log('Authenticated request config:', {
            method: config.method,
            headers: config.headers,
            data: config.data
          });
          return config;
        },
        error => {
          console.error('Authenticated API request error:', error);
          return Promise.reject(error);
        }
      );

      console.log('Created authenticated API instance with headers:',
        token ? { 'Authorization': 'Bearer ' + token.substring(0, 10) + '...' } : 'No auth header');
    }

    return authenticatedApi;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Error getting token:', error);
    }
    return api; // Return the unauthenticated api as fallback
  }
};

export default api; 