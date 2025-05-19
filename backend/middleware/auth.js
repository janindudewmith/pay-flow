import { clerkClient } from '@clerk/clerk-sdk-node';

export const authMiddleware = async (req, res, next) => {
  try {
    const sessionToken = req.headers.authorization?.split(' ')[1];

    if (!sessionToken) {
      return res.status(401).json({
        success: false,
        message: 'No authentication token provided',
      });
    }

    // Verify session with Clerk
    const session = await clerkClient.sessions.verifySession(sessionToken);
    const user = await clerkClient.users.getUser(session.userId);

    // Extract user role from metadata
    const role = user.publicMetadata.role || 'user';
    const email = user.emailAddresses[0].emailAddress;

    // Add user info to request
    req.user = {
      id: user.id,
      email,
      role,
    };

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid authentication token',
      error: error.message,
    });
  }
};
