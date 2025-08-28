# Backend Deployment Instructions (Render)

## Prerequisites

1. A [Render](https://render.com) account
2. Your project pushed to a Git repository (GitHub, GitLab, or Bitbucket)
3. A MongoDB database (MongoDB Atlas recommended for cloud deployment)

## Deployment Steps

### 1. Prepare Your MongoDB Database

1. **Create a MongoDB Atlas Cluster** (if you don't have one already)
   - Sign up or log in at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Create a new cluster (the free tier is sufficient to start)
   - Configure network access to allow connections from anywhere (for Render)
   - Create a database user with read/write permissions
   - Get your connection string (it will look like: `mongodb+srv://username:password@cluster.mongodb.net/pay-flow`)

### 2. Deploy to Render

1. **Login to Render**

   - Go to [render.com](https://render.com) and sign in or create an account

2. **Create a New Web Service**

   - Click "New" > "Web Service"
   - Connect your Git repository if you haven't already
   - Select your repository

3. **Configure Web Service**

   - Name: Choose a name for your service (e.g., "pay-flow-backend")
   - Root Directory: Select "backend" (since your backend code is in a subfolder)
   - Environment: "Node"
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Instance Type: Select an appropriate plan (Free tier is good for testing)

4. **Environment Variables**

   - Add all the required environment variables listed in the `deployment-env-variables.md` file:
     - `NODE_ENV`: `production`
     - `PORT`: `10000` (Render will override this with its own PORT)
     - `MONGODB_URI`: Your MongoDB connection string
     - `JWT_SECRET`: A strong secret key
     - `CLERK_SECRET_KEY`: Your Clerk secret key
     - Add any other environment variables your application needs

5. **Create Web Service**

   - Click "Create Web Service"
   - Wait for the build and deployment to complete

6. **Verify Deployment**
   - Once deployed, Render will provide you with a URL (e.g., https://pay-flow-backend.onrender.com)
   - Visit `https://your-render-url.onrender.com/` to verify the API is running
   - You should see the message "PayFlow API is running"

### 3. CORS Configuration

Your backend already has CORS configured to accept requests from any origin. For production, you might want to update this to only allow specific origins:

```javascript
// Update this in server.js
app.use(
  cors({
    origin: ["https://your-frontend-url.vercel.app", "http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
```

### 4. Continuous Deployment

Render automatically sets up continuous deployment from your Git repository:

- Any push to the main branch will trigger a new deployment

### 5. Custom Domain (Optional)

1. **Add Custom Domain**
   - Go to your web service settings in Render
   - Navigate to "Custom Domains"
   - Add your custom domain and follow the verification steps

### Troubleshooting

1. **Build Errors**

   - Check the build logs in Render for any errors
   - Ensure all dependencies are properly installed

2. **Database Connection Issues**

   - Verify your MongoDB connection string is correct
   - Ensure network access is configured to allow connections from Render
   - Check MongoDB Atlas logs for connection attempts

3. **Environment Variable Issues**

   - Double-check all environment variables are set correctly
   - Ensure sensitive values are properly escaped

4. **Memory/CPU Limitations**
   - Free tier has limitations; upgrade if you need more resources
   - Monitor your service's resource usage in the Render dashboard
