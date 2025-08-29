import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import useAdminAuth from '../hooks/useAdminAuth';

/**
 * A route component that only allows regular users (non-admins) to access
 * Redirects admins to their dashboard
 */
const UserOnlyRoute = ({ children }) => {
  const { isSignedIn } = useUser();
  const { isAdmin, adminRole, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If user is not signed in, allow access (will be handled by Clerk)
  if (!isSignedIn) {
    return children;
  }

  // If user is an admin, redirect to their dashboard
  if (isAdmin) {
    const dashboardPath = adminRole === 'department_head'
      ? '/department/dashboard'
      : '/finance/dashboard';
    return <Navigate to={dashboardPath} replace />;
  }

  // User is signed in but not an admin, allow access
  return children;
};

export default UserOnlyRoute; 