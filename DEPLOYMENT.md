# PayFlow Application Deployment Guide

This guide will walk you through deploying the PayFlow application, with the backend on Render and the frontend on Vercel.

## Overview

The PayFlow application consists of two main parts:

1. **Backend**: Node.js/Express API deployed on Render
2. **Frontend**: React application deployed on Vercel

## Deployment Process

### Step 1: Prepare Your Environment Variables

Before deployment, gather all the necessary credentials and environment variables:

- MongoDB connection string
- Clerk API keys
- JWT secret
- Email service credentials

See `deployment-env-variables.md` for a complete list of required variables.

### Step 2: Deploy the Backend on Render

1. Deploy the backend first, as the frontend will need the backend URL
2. Follow the detailed instructions in `backend-deployment-render.md`
3. After successful deployment, note your backend URL (e.g., `https://pay-flow-backend.onrender.com`)

### Step 3: Deploy the Frontend on Vercel

1. Use the backend URL from Step 2 as the `VITE_API_URL` environment variable
2. Follow the detailed instructions in `frontend-deployment-vercel.md`
3. After successful deployment, note your frontend URL (e.g., `https://pay-flow-frontend.vercel.app`)

### Step 4: Update CORS Settings (Optional)

For better security, update the CORS settings in your backend to only allow requests from your frontend domain.

### Step 5: Test the Deployed Application

1. Open your frontend URL in a browser
2. Test all functionality:
   - User registration and login
   - Form submissions
   - Admin features
   - Any other critical features

## Deployment Files

The following files have been created to help with your deployment:

1. `deployment-env-variables.md` - List of all required environment variables
2. `backend-deployment-render.md` - Detailed backend deployment instructions
3. `frontend-deployment-vercel.md` - Detailed frontend deployment instructions

## Additional Notes

### Database Backups

If you're using MongoDB Atlas, set up regular backups of your database to prevent data loss.

### Monitoring

Both Render and Vercel provide monitoring tools to track your application's performance and errors.

### Scaling

- **Render**: Upgrade your plan if you need more resources
- **Vercel**: Consider using Vercel's Edge Network for improved performance
- **MongoDB Atlas**: Scale your cluster as your data grows

### Troubleshooting

If you encounter issues during deployment, refer to the troubleshooting sections in the respective deployment guides.

## Next Steps After Deployment

1. **Set up monitoring**: Configure alerts for downtime or errors
2. **Implement CI/CD**: Set up automated testing before deployment
3. **Custom domain**: Configure custom domains for both frontend and backend
4. **SSL**: Ensure SSL is properly configured (both Vercel and Render provide this automatically)
5. **Performance optimization**: Monitor and optimize application performance

## Support

If you need assistance with deployment, consult the documentation for:

- [Render](https://render.com/docs)
- [Vercel](https://vercel.com/docs)
- [MongoDB Atlas](https://docs.atlas.mongodb.com/)
- [Clerk](https://clerk.com/docs)
