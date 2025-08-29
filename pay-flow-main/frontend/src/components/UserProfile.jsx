import React, { useEffect, useState } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import axios from 'axios';

const UserProfile = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [userSaved, setUserSaved] = useState(false);

  useEffect(() => {
    const saveUserToDatabase = async () => {
      if (isLoaded && isSignedIn && user) {
        try {
          setSaving(true);
          setError(null);

          console.log('User is signed in, attempting to save to database...');

          // Prepare user data
          const userData = {
            clerkId: user.id,
            email: user.primaryEmailAddress?.emailAddress,
            fullName: user.fullName,
            firstName: user.firstName,
            lastName: user.lastName,
            profileImageUrl: user.imageUrl
          };

          console.log('Saving user data to database:', userData);
          console.log('Making API request to: http://localhost:5000/api/users/create-update');

          // Use fetch API instead of axios as an alternative
          const response = await fetch('http://localhost:5000/api/users/create-update', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(userData)
          });

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json();
          console.log('User saved response:', data);
          setUserSaved(true);
        } catch (err) {
          console.error('Error saving user to database:', err);
          console.error('Error details:', {
            message: err.message,
            stack: err.stack
          });
          setError(err.message || 'Error saving user data');
        } finally {
          setSaving(false);
        }
      }
    };

    saveUserToDatabase();
  }, [isLoaded, isSignedIn, user, getToken]);

  // This component doesn't render anything visible
  return null;
};

export default UserProfile; 