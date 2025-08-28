@echo off
echo ========================================
echo PayFlow Vercel Deployment Script
echo ========================================
echo.

REM Check if Vercel CLI is installed
vercel --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Installing Vercel CLI...
    npm install -g vercel
    if %errorlevel% neq 0 (
        echo Failed to install Vercel CLI. Please install manually: npm install -g vercel
        pause
        exit /b 1
    )
)

echo.
echo Step 1: Deploying Backend...
echo ========================================
cd backend

REM Check if .env file exists
if not exist .env (
    echo WARNING: No .env file found in backend directory!
    echo Please create .env file with required environment variables.
    echo See env.example for reference.
    echo.
    pause
)

echo Deploying backend to Vercel...
vercel --prod --yes

if %errorlevel% neq 0 (
    echo Backend deployment failed!
    pause
    exit /b 1
)

REM Get the backend URL from the deployment
for /f "tokens=*" %%i in ('vercel ls --json ^| findstr "url"') do set BACKEND_URL=%%i

echo.
echo Backend deployed successfully!
echo Backend URL: %BACKEND_URL%
echo.

echo Step 2: Deploying Frontend...
echo ========================================
cd ..\frontend

REM Check if .env file exists
if not exist .env (
    echo WARNING: No .env file found in frontend directory!
    echo Please create .env file with required environment variables.
    echo See env.example for reference.
    echo.
    pause
)

echo Deploying frontend to Vercel...
vercel --prod --yes

if %errorlevel% neq 0 (
    echo Frontend deployment failed!
    pause
    exit /b 1
)

echo.
echo ========================================
echo Deployment Complete!
echo ========================================
echo.
echo IMPORTANT: Update your environment variables in Vercel dashboard:
echo.
echo Backend Project:
echo - MONGODB_URI: Your MongoDB Atlas connection string
echo - CLERK_SECRET_KEY: Your Clerk secret key
echo - JWT_SECRET: Your JWT secret
echo - EMAIL_USER: Your email for notifications
echo - EMAIL_PASS: Your email app password
echo - FRONTEND_URL: Your frontend Vercel URL
echo.
echo Frontend Project:
echo - VITE_API_URL: Your backend Vercel URL
echo - VITE_CLERK_PUBLISHABLE_KEY: Your Clerk publishable key
echo.
echo Visit https://vercel.com/dashboard to configure environment variables
echo.
pause
