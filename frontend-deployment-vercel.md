# Frontend Deployment Instructions (Vercel)

## Prerequisites

1. A [Vercel](https://vercel.com) account
2. Your project pushed to a Git repository (GitHub, GitLab, or Bitbucket)

## Deployment Steps

### 1. Prepare Your Frontend Code

Your frontend code is already configured for deployment with:

- Updated API endpoint configuration using environment variables
- Proper vercel.json configuration file

### 2. Deploy to Vercel

1. **Login to Vercel**

   - Go to [vercel.com](https://vercel.com) and sign in or create an account

2. **Import Your Project**

   - Click "Add New" > "Project"
   - Connect your Git provider if you haven't already
   - Select your repository from the list

3. **Configure Project**

   - Project Name: Choose a name for your deployment (e.g., "pay-flow-frontend")
   - Framework Preset: Select "Vite"
   - Root Directory: Select "frontend" (since your frontend code is in a subfolder)
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Environment Variables**

   - Add the following environment variables:
     - `VITE_API_URL`: Your backend URL from Render (e.g., https://pay-flow-backend.onrender.com)
     - `VITE_CLERK_PUBLISHABLE_KEY`: Your Clerk publishable key

5. **Deploy**

   - Click "Deploy"
   - Wait for the build and deployment to complete

6. **Verify Deployment**
   - Once deployed, Vercel will provide you with a URL (e.g., https://pay-flow-frontend.vercel.app)
   - Visit the URL to ensure your application is working correctly

### 3. Custom Domain (Optional)

1. **Add Custom Domain**
   - Go to your project settings in Vercel
   - Navigate to "Domains"
   - Add your custom domain and follow the verification steps

### 4. Continuous Deployment

Vercel automatically sets up continuous deployment from your Git repository:

- Any push to the main branch will trigger a new deployment
- You can configure preview deployments for pull requests

### Troubleshooting

1. **Build Errors**

   - Check the build logs in Vercel for any errors
   - Ensure all dependencies are properly installed
   - Verify your Vite configuration is correct

2. **API Connection Issues**

   - Verify your backend is deployed and accessible
   - Check that the VITE_API_URL environment variable is set correctly
   - Ensure CORS is properly configured on your backend

3. **Clerk Authentication Issues**
   - Verify your Clerk keys are correct
   - Ensure the Clerk domain settings include your Vercel deployment URL
