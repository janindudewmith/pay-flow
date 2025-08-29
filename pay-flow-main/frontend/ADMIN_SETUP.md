# Admin Authentication Setup

This document explains how to set up and configure the JWT-based authentication system for administrators (Department Heads and Finance Officers) in the PayFlow application.

## Overview

The admin authentication system uses JSON Web Tokens (JWT) for secure authentication and authorization. Unlike regular users who authenticate through Clerk, administrators use a dedicated JWT-based system.

## Configuration

### Backend Configuration

1. **Environment Variables**

   Add the following environment variables to your backend `.env` file:

   ```
   # JWT Configuration
   JWT_SECRET=your_secure_jwt_secret_key_here
   JWT_EXPIRY=24h

   # Admin Credentials (Optional - can be configured in the code directly)
   ADMIN_EIE_EMAIL=head.eie.ruh@gmail.com
   ADMIN_EIE_PASSWORD=headeie123
   ADMIN_EIE_ROLE=department_head
   ADMIN_EIE_NAME=Dr. Rajitha Udawalpola
   ADMIN_EIE_DEPARTMENT=EIE

   ADMIN_CEE_EMAIL=head.cee.ruh@gmail.com
   ADMIN_CEE_PASSWORD=headcee123
   ADMIN_CEE_ROLE=department_head
   ADMIN_CEE_NAME=Dr. T.N. Wickramarachchi
   ADMIN_CEE_DEPARTMENT=CEE

   ADMIN_MME_EMAIL=head.mme.ruh@gmail.com
   ADMIN_MME_PASSWORD=headmme123
   ADMIN_MME_ROLE=department_head
   ADMIN_MME_NAME=Dr. B. Annasiwaththa
   ADMIN_MME_DEPARTMENT=MME

   ADMIN_FINANCE_EMAIL=sab.finance.ruh@gmail.com
   ADMIN_FINANCE_PASSWORD=finance123
   ADMIN_FINANCE_ROLE=finance_officer
   ADMIN_FINANCE_NAME=Finance Officer
   ```

   **Important**: In a production environment, you should not store passwords in environment variables. Instead, use a secure database with properly hashed passwords.

2. **Install Required Packages**

   ```bash
   cd backend
   npm install jsonwebtoken bcryptjs express-validator
   ```

### Frontend Configuration

1. **Environment Variables**

   Add the following environment variable to your frontend `.env` file:

   ```
   VITE_API_URL=http://localhost:5000/api
   ```

## Security Considerations

1. **Password Storage**: In a production environment, admin credentials should be stored in a database with proper password hashing.

2. **JWT Secret**: Use a strong, random JWT secret key and keep it secure.

3. **Token Expiry**: The default token expiry is set to 24 hours. Adjust this based on your security requirements.

4. **HTTPS**: Ensure all API communications happen over HTTPS in production.

## Admin Login Flow

1. Admins navigate to `/admin-login`
2. They enter their email, password, and select their role (Department Head or Finance Officer)
3. The system authenticates them and issues a JWT token
4. The token is stored in localStorage for persistent sessions
5. Based on their role, they are redirected to the appropriate dashboard

## Protected Routes

The following routes are protected for admin access:

- `/department/dashboard` - Department Head only
- `/department/requests/:requestId` - Department Head only
- `/finance/dashboard` - Finance Officer only
- `/finance/requests/:requestId` - Finance Officer only

## Adding New Admins

To add new admin users:

1. Add their credentials to the `adminCredentials` array in `backend/controllers/adminAuthController.js`
2. Or add them to your environment variables following the naming pattern above

## Logout

When an admin logs out:

1. The JWT token is removed from localStorage
2. The admin is redirected to the login page

## Troubleshooting

If you encounter authentication issues:

1. Check that the JWT_SECRET is correctly set in your backend environment
2. Verify that the admin credentials are correct
3. Check the browser console for any errors
4. Ensure the backend API is accessible from the frontend

For any other issues, please contact the development team.
