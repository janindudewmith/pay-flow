import React from 'react';
import { Navigate } from 'react-router-dom';
import useAdminAuth from '../hooks/useAdminAuth';

/**
 * Protected route component for admin routes
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authorized
 * @param {string} props.requiredRole - Required admin role (department_head or finance_officer)
 * @returns {React.ReactNode} - Protected route component
 */
const AdminProtectedRoute = ({ children, requiredRole }) => {
  const { isAdmin, adminRole, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Check if user is an admin
  if (!isAdmin) {
    return <Navigate to="/admin-login" replace />;
  }

  // If a specific role is required, check if the admin has that role
  if (requiredRole && adminRole !== requiredRole) {
    return <Navigate to="/admin-login" replace />;
  }

  // All checks passed, render the protected component
  return children;
};

export default AdminProtectedRoute; 