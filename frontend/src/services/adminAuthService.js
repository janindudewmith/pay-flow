import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Admin Authentication Service
 */
class AdminAuthService {
  constructor() {
    // Set up axios interceptor to add auth token to requests
    axios.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token && config.url.includes('/api/admin')) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  /**
   * Login admin user
   * @param {string} email - Admin email
   * @param {string} password - Admin password
   * @param {string} role - Admin role (department_head or finance_officer)
   * @returns {Promise} - Promise with login response
   */
  async login(email, password, role) {
    try {
      const response = await axios.post(`${API_URL}/admin/login`, {
        email,
        password,
        role
      });

      if (response.data.success && response.data.token) {
        // Store token and admin info in localStorage
        this.setToken(response.data.token);
        this.setAdminInfo(response.data.admin);
      }

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get current admin user profile
   * @returns {Promise} - Promise with admin profile
   */
  async getCurrentAdmin() {
    try {
      const response = await axios.get(`${API_URL}/admin/me`, {
        headers: this.getAuthHeader()
      });

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Set auth token in localStorage
   * @param {string} token - JWT token
   */
  setToken(token) {
    localStorage.setItem('adminToken', token);
  }

  /**
   * Get auth token from localStorage
   * @returns {string|null} - JWT token or null
   */
  getToken() {
    return localStorage.getItem('adminToken');
  }

  /**
   * Set admin info in localStorage
   * @param {object} adminInfo - Admin info object
   */
  setAdminInfo(adminInfo) {
    localStorage.setItem('adminInfo', JSON.stringify(adminInfo));
  }

  /**
   * Check if user is authenticated as admin
   * @returns {boolean} - True if authenticated
   */
  isAuthenticated() {
    return !!this.getToken();
  }

  /**
   * Get admin info from localStorage
   * @returns {object|null} - Admin info or null
   */
  getAdminInfo() {
    const adminInfo = localStorage.getItem('adminInfo');
    return adminInfo ? JSON.parse(adminInfo) : null;
  }

  /**
   * Get admin role
   * @returns {string|null} - Admin role or null
   */
  getRole() {
    const adminInfo = this.getAdminInfo();
    return adminInfo ? adminInfo.role : null;
  }

  /**
   * Get admin department
   * @returns {string|null} - Admin department or null
   */
  getDepartment() {
    const adminInfo = this.getAdminInfo();
    return adminInfo ? adminInfo.department : null;
  }

  /**
   * Get admin name
   * @returns {string|null} - Admin name or null
   */
  getName() {
    const adminInfo = this.getAdminInfo();
    return adminInfo ? adminInfo.name : null;
  }

  /**
   * Logout admin user
   */
  logout() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminInfo');
    // Redirect to login page or home
    window.location.href = '/admin-login';
  }

  /**
   * Get authorization header
   * @returns {object} - Header with token
   */
  getAuthHeader() {
    const token = this.getToken();
    return {
      Authorization: token ? `Bearer ${token}` : ''
    };
  }

  /**
   * Handle API errors
   * @param {Error} error - Axios error
   * @returns {Error} - Formatted error
   */
  handleError(error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      if (error.response.status === 401) {
        // Unauthorized - clear token and redirect to login
        // Don't logout here as it causes redirect during login attempts
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminInfo');
      }

      const errorMessage = error.response.data.message || 'An error occurred';
      throw new Error(errorMessage);
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('No response from server. Please check your connection.');
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }
}

export default new AdminAuthService(); 