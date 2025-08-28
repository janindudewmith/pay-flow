#!/bin/bash

echo "========================================"
echo "PayFlow Vercel Deployment Script"
echo "========================================"
echo

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Installing Vercel CLI..."
    npm install -g vercel
    if [ $? -ne 0 ]; then
        echo "Failed to install Vercel CLI. Please install manually: npm install -g vercel"
        exit 1
    fi
fi

echo
echo "Step 1: Deploying Backend..."
echo "========================================"
cd backend

# Check if .env file exists
if [ ! -f .env ]; then
    echo "WARNING: No .env file found in backend directory!"
    echo "Please create .env file with required environment variables."
    echo "See env.example for reference."
    echo
    read -p "Press Enter to continue..."
fi

echo "Deploying backend to Vercel..."
vercel --prod --yes

if [ $? -ne 0 ]; then
    echo "Backend deployment failed!"
    exit 1
fi

# Get the backend URL from the deployment
BACKEND_URL=$(vercel ls --json | grep -o '"url":"[^"]*"' | head -1 | cut -d'"' -f4)

echo
echo "Backend deployed successfully!"
echo "Backend URL: $BACKEND_URL"
echo

echo "Step 2: Deploying Frontend..."
echo "========================================"
cd ../frontend

# Check if .env file exists
if [ ! -f .env ]; then
    echo "WARNING: No .env file found in frontend directory!"
    echo "Please create .env file with required environment variables."
    echo "See env.example for reference."
    echo
    read -p "Press Enter to continue..."
fi

echo "Deploying frontend to Vercel..."
vercel --prod --yes

if [ $? -ne 0 ]; then
    echo "Frontend deployment failed!"
    exit 1
fi

echo
echo "========================================"
echo "Deployment Complete!"
echo "========================================"
echo
echo "IMPORTANT: Update your environment variables in Vercel dashboard:"
echo
echo "Backend Project:"
echo "- MONGODB_URI: Your MongoDB Atlas connection string"
echo "- CLERK_SECRET_KEY: Your Clerk secret key"
echo "- JWT_SECRET: Your JWT secret"
echo "- EMAIL_USER: Your email for notifications"
echo "- EMAIL_PASS: Your email app password"
echo "- FRONTEND_URL: Your frontend Vercel URL"
echo
echo "Frontend Project:"
echo "- VITE_API_URL: Your backend Vercel URL"
echo "- VITE_CLERK_PUBLISHABLE_KEY: Your Clerk publishable key"
echo
echo "Visit https://vercel.com/dashboard to configure environment variables"
echo
