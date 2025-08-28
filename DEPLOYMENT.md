# PayFlow Deployment Guide - Vercel

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **MongoDB Atlas**: Set up a cloud database at [mongodb.com/atlas](https://mongodb.com/atlas)
3. **Environment Variables**: Prepare your environment variables

## Environment Variables Setup

### Backend Environment Variables
Create a `.env` file in the `backend/` directory with:

```env
# MongoDB Connection
MONGODB_URI=your_mongodb_atlas_connection_string

# Clerk Authentication
CLERK_SECRET_KEY=your_clerk_secret_key

# JWT Secret
JWT_SECRET=your_jwt_secret_key

# Email Service (if using)
EMAIL_USER=your_email
EMAIL_PASS=your_email_password

# Other configurations
NODE_ENV=production
PORT=5000
```

### Frontend Environment Variables
Create a `.env` file in the `frontend/` directory with:

```env
# Backend API URL (will be your Vercel backend URL)
VITE_API_URL=https://your-backend-project.vercel.app

# Clerk Frontend Keys
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

## Deployment Steps

### 1. Deploy Backend

```bash
# Navigate to backend directory
cd backend

# Install Vercel CLI if not already installed
npm i -g vercel

# Deploy backend
vercel --prod
```

**Important**: When prompted:
- Set the project name (e.g., `pay-flow-backend`)
- Set the root directory to `./`
- Set the build command to `npm install`
- Set the output directory to `./`
- Set the install command to `npm install`

### 2. Deploy Frontend

```bash
# Navigate to frontend directory
cd frontend

# Deploy frontend
vercel --prod
```

**Important**: When prompted:
- Set the project name (e.g., `pay-flow-frontend`)
- Set the root directory to `./`
- Set the build command to `npm run build`
- Set the output directory to `dist`

### 3. Configure Environment Variables in Vercel

#### Backend Project:
1. Go to your Vercel dashboard
2. Select the backend project
3. Go to Settings → Environment Variables
4. Add all the environment variables from your `.env` file

#### Frontend Project:
1. Go to your Vercel dashboard
2. Select the frontend project
3. Go to Settings → Environment Variables
4. Add the frontend environment variables

### 4. Update Frontend API Configuration

After deploying the backend, update the frontend's API configuration to use the new backend URL.

## Post-Deployment

1. **Test API Endpoints**: Verify all backend routes are working
2. **Test Frontend**: Ensure the frontend can communicate with the backend
3. **Monitor Logs**: Check Vercel function logs for any errors
4. **Set Custom Domain** (Optional): Configure your custom domain in Vercel

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Ensure CORS is properly configured in backend
2. **Environment Variables**: Double-check all environment variables are set in Vercel
3. **MongoDB Connection**: Verify MongoDB Atlas connection string and network access
4. **Build Errors**: Check build logs in Vercel dashboard

### Useful Commands:

```bash
# View deployment logs
vercel logs

# Redeploy with latest changes
vercel --prod

# Check deployment status
vercel ls
```

## Architecture Notes

- **Backend**: Deployed as serverless functions on Vercel
- **Frontend**: Deployed as static site on Vercel
- **Database**: MongoDB Atlas (cloud-hosted)
- **Authentication**: Clerk (handles user management)

## Cost Considerations

- **Vercel Hobby Plan**: Free tier available
- **MongoDB Atlas**: Free tier available (512MB)
- **Clerk**: Free tier available (5,000 monthly active users)

## Support

For deployment issues:
1. Check Vercel documentation
2. Review function logs in Vercel dashboard
3. Verify environment variables
4. Test locally before deploying
