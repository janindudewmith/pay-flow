import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Make sure environment variables are loaded
dotenv.config();

// Helper function to determine role from email
const getRoleFromEmail = (email) => {
  if (!email) return 'user';

  // Finance officer email check
  if (email === process.env.FINANCE_OFFICER || email.includes('finance')) {
    return 'finance_officer';
  }

  // Department head email check
  if (email === process.env.HOD_EIE ||
    email === process.env.HOD_CEE ||
    email === process.env.HOD_MME ||
    email.includes('hod') ||
    email.includes('head')) {
    return 'department_head';
  }

  return 'user';
};

export const authMiddleware = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    let userId = null;
    let userEmail = null;

    // If there's an auth header with token, use it to get the user ID
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];

      if (token) {
        try {
          // Decode the token without verification
          const decoded = jwt.decode(token);

          if (decoded && decoded.sub) {
            // Use Clerk's subject claim as user ID
            userId = decoded.sub;
            userEmail = decoded.email || null;
          }
        } catch (error) {
          console.error('Token processing error:', error);
        }
      }
    }

    // Extract userId from the request body (for form submissions)
    if (!userId && req.body && req.body.clerkId) {
      userId = req.body.clerkId;
    }

    // Get email from request body if available
    userEmail = req.body?.email || userEmail || 'user@example.com';

    // As a last resort, use a default user ID for testing
    if (!userId) {
      userId = 'user_2xMtfrtBNYseM6K3jTYjDYzNcZD';
    }

    // Determine role based on email
    const userRole = getRoleFromEmail(userEmail);

    // Create a consistent user object
    req.user = {
      id: userId,
      email: userEmail,
      fullName: req.body?.fullName || 'User',
      role: userRole
    };

    console.log('Auth middleware: Using user ID:', userId);
    console.log('Auth middleware: Using email:', userEmail);
    console.log('Auth middleware: Assigned role:', userRole);

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);

    // Even with an error, create a fallback user
    req.user = {
      id: 'user_2xMtfrtBNYseM6K3jTYjDYzNcZD',
      email: 'fallback@example.com',
      fullName: 'Fallback User',
      role: 'user'
    };

    next();
  }
};
