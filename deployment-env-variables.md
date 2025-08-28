# Environment Variables for Deployment

## Backend Environment Variables (Render)

```
NODE_ENV=production
PORT=10000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLERK_SECRET_KEY=your_clerk_secret_key

# Email configuration (if using nodemailer)
EMAIL_USER=your_email_username
EMAIL_PASSWORD=your_email_password
EMAIL_HOST=your_email_host
EMAIL_PORT=your_email_port
EMAIL_FROM=your_from_email

# Other service credentials as needed
```

## Frontend Environment Variables (Vercel)

```
VITE_API_URL=https://your-backend-url.onrender.com
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

## Notes:

1. Replace placeholder values with your actual credentials
2. Make sure to use the correct MongoDB connection string for your production database
3. Generate a strong JWT_SECRET for production
4. The backend URL in VITE_API_URL should match your Render deployment URL
5. Never commit these environment variables to your repository
