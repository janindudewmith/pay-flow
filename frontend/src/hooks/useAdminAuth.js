import { useState, useEffect } from 'react';
import adminAuthService from '../services/adminAuthService';

/**
 * Custom hook for admin authentication
 * @returns {Object} Admin authentication state and methods
 */
export const useAdminAuth = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminRole, setAdminRole] = useState(null);
  const [adminDepartment, setAdminDepartment] = useState(null);
  const [adminName, setAdminName] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authToken, setAuthToken] = useState(localStorage.getItem('adminToken'));

  const checkAdminStatus = async () => {
    try {
      setLoading(true);
      setError(null);

      if (adminAuthService.isAuthenticated()) {
        // Get admin info from localStorage
        const adminInfo = adminAuthService.getAdminInfo();

        if (adminInfo) {
          setIsAdmin(true);
          setAdminRole(adminInfo.role);
          setAdminDepartment(adminInfo.department);
          setAdminName(adminInfo.name);
        } else {
          // If no admin info in localStorage, try to fetch from server
          try {
            const response = await adminAuthService.getCurrentAdmin();

            if (response.success) {
              setIsAdmin(true);
              setAdminRole(response.role);
              setAdminDepartment(response.department);
              setAdminName(response.name);

              // Update localStorage with fresh data
              localStorage.setItem('adminInfo', JSON.stringify({
                email: response.email,
                role: response.role,
                name: response.name,
                department: response.department
              }));
            } else {
              // Not an admin or token expired
              adminAuthService.logout();
              setIsAdmin(false);
              setAdminRole(null);
              setAdminDepartment(null);
              setAdminName(null);
            }
          } catch (err) {
            // Token might be invalid or expired
            adminAuthService.logout();
            setIsAdmin(false);
            setAdminRole(null);
            setAdminDepartment(null);
            setAdminName(null);
          }
        }
      } else {
        // No token found
        setIsAdmin(false);
        setAdminRole(null);
        setAdminDepartment(null);
        setAdminName(null);
      }
    } catch (err) {
      setError(err.message || 'Authentication error');
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  // Check admin status on mount and when authToken changes
  useEffect(() => {
    checkAdminStatus();
  }, [authToken]);

  // Add a listener for localStorage changes to detect login/logout across tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'adminToken') {
        setAuthToken(e.newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const login = async (email, password, role) => {
    try {
      setLoading(true);
      setError(null);

      const response = await adminAuthService.login(email, password, role);

      if (response.success) {
        // Update local state immediately after successful login
        setIsAdmin(true);
        setAdminRole(response.admin.role);
        setAdminDepartment(response.admin.department);
        setAdminName(response.admin.name);

        // Update authToken state to trigger useEffect
        setAuthToken(localStorage.getItem('adminToken'));

        return { success: true };
      } else {
        setError(response.message || 'Login failed');
        return { success: false, message: response.message || 'Login failed. Please check your credentials.' };
      }
    } catch (err) {
      setError(err.message || 'Login error');
      return { success: false, message: err.message || 'An unexpected error occurred. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    adminAuthService.logout();
    setIsAdmin(false);
    setAdminRole(null);
    setAdminDepartment(null);
    setAdminName(null);
    setAuthToken(null);
  };

  return {
    isAdmin,
    adminRole,
    adminDepartment,
    adminName,
    loading,
    error,
    login,
    logout,
    checkAdminStatus
  };
};

export default useAdminAuth; 