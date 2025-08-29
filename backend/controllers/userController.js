import User from '../models/User.js';

// Create or update a user in the database
export const createOrUpdateUser = async (req, res) => {
  try {
    const { clerkId, email, fullName, firstName, lastName, profileImageUrl } = req.body;

    console.log('User sign in received:', req.body);

    // Check required fields
    if (!clerkId || !email) {
      return res.status(400).json({
        success: false,
        message: 'Clerk ID and email are required'
      });
    }

    // Check if user already exists
    let user = await User.findOne({ clerkId });

    if (user) {
      // Update existing user
      user.email = email;
      user.fullName = fullName || `${firstName || ''} ${lastName || ''}`.trim();
      user.firstName = firstName || '';
      user.lastName = lastName || '';
      user.profileImageUrl = profileImageUrl || user.profileImageUrl;
      user.lastLogin = new Date();

      await user.save();

      console.log('User updated:', user._id);

      return res.status(200).json({
        success: true,
        message: 'User updated successfully',
        user
      });
    } else {
      // Create new user
      const newUser = await User.create({
        clerkId,
        email,
        fullName: fullName || `${firstName || ''} ${lastName || ''}`.trim(),
        firstName: firstName || '',
        lastName: lastName || '',
        profileImageUrl: profileImageUrl || '',
        lastLogin: new Date()
      });

      console.log('New user created:', newUser._id);

      return res.status(201).json({
        success: true,
        message: 'User created successfully',
        user: newUser
      });
    }
  } catch (error) {
    console.error('Error creating/updating user:', error);
    return res.status(500).json({
      success: false,
      message: 'Error creating/updating user',
      error: error.message
    });
  }
};

// Get current user
export const getCurrentUser = async (req, res) => {
  try {
    const { clerkId } = req.params;

    if (!clerkId) {
      return res.status(400).json({
        success: false,
        message: 'Clerk ID is required'
      });
    }

    const user = await User.findOne({ clerkId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    return res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Error getting user:', error);
    return res.status(500).json({
      success: false,
      message: 'Error getting user',
      error: error.message
    });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const { clerkId } = req.params;
    const { department, position } = req.body;

    if (!clerkId) {
      return res.status(400).json({
        success: false,
        message: 'Clerk ID is required'
      });
    }

    const user = await User.findOne({ clerkId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update user fields
    if (department) user.department = department;
    if (position) user.position = position;

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'User profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return res.status(500).json({
      success: false,
      message: 'Error updating user profile',
      error: error.message
    });
  }
};

// Get all users (admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-__v');

    return res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    console.error('Error getting users:', error);
    return res.status(500).json({
      success: false,
      message: 'Error getting users',
      error: error.message
    });
  }
}; 