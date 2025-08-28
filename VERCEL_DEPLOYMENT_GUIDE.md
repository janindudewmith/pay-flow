# 🚀 PayFlow Vercel Deployment Guide (Updated)

## ✨ What's Been Updated

Your PayFlow application has been **fully optimized** for Vercel deployment with the following changes:

### Backend Changes ✅
- **Serverless Ready**: `server.js` now exports the app for Vercel's serverless functions
- **Production CORS**: Updated CORS configuration for production domains
- **Environment Handling**: Better environment variable handling for production
- **MongoDB Optimization**: Enhanced connection options for cloud deployment
- **Health Endpoints**: Added `/api/health` endpoint for monitoring

### Frontend Changes ✅
- **Environment Variables**: All hardcoded URLs replaced with environment variables
- **Production Logging**: Console logs only show in development mode
- **API Configuration**: Dynamic API URL configuration for different environments

### Configuration Files ✅
- **Vercel Configs**: Updated `vercel.json` files for both projects
- **Environment Examples**: Created `env.example` files showing required variables
- **Deployment Scripts**: Enhanced deployment scripts with better error handling

## 🚀 Quick Deployment

### Option 1: Automated Scripts
```bash
# Windows
deploy.bat

# Mac/Linux
chmod +x deploy.sh
./deploy.sh
```

### Option 2: Manual Deployment
Follow the detailed steps below.

## 📋 Prerequisites

1. **Vercel Account**: [Sign up here](https://vercel.com/signup)
2. **MongoDB Atlas**: [Set up here](https://mongodb.com/atlas)
3. **Clerk Account**: [Sign up here](https://clerk.com)
4. **Node.js & npm**: Latest LTS version

## 🔧 Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

## 🌍 Step 2: Set Up MongoDB Atlas

1. **Create Atlas Account**: Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. **Create Cluster**: Choose free tier (M0)
3. **Set Up Database User**: Create username/password
4. **Get Connection String**: Copy the connection string
5. **Network Access**: Allow access from anywhere (0.0.0.0/0) for now

Your connection string will look like:
```
mongodb+srv://username:password@cluster.mongodb.net/payflow
```

## 🔑 Step 3: Set Up Clerk Authentication

1. **Create Clerk Account**: Go to [clerk.com](https://clerk.com)
2. **Create Application**: Set up your app
3. **Get API Keys**: Copy both publishable and secret keys

## 📝 Step 4: Create Environment Files

### Backend Environment (backend/.env)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/payflow
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key_here
JWT_SECRET=your_super_secret_jwt_key_here
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.vercel.app
PORT=5000
```

### Frontend Environment (frontend/.env)
```env
VITE_API_URL=https://your-backend-project.vercel.app
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key_here
VITE_NODE_ENV=production
```

## 🚀 Step 5: Deploy Backend

```bash
cd backend
vercel --prod
```

**When prompted:**
- Project name: `pay-flow-backend`
- Root directory: `./`
- Build command: `npm install`
- Output directory: `./`
- Override settings: `No`

## 🌐 Step 6: Deploy Frontend

```bash
cd frontend
vercel --prod
```

**When prompted:**
- Project name: `pay-flow-frontend`
- Root directory: `./`
- Build command: `npm run build`
- Output directory: `dist`
- Override settings: `No`

## ⚙️ Step 7: Configure Environment Variables in Vercel

### Backend Project
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select `pay-flow-backend`
3. Go to **Settings** → **Environment Variables**
4. Add each variable from your backend `.env` file

### Frontend Project
1. Select `pay-flow-frontend`
2. Go to **Settings** → **Environment Variables**
3. Add each variable from your frontend `.env` file

## 🔄 Step 8: Update Frontend API URL

After backend deployment, update `VITE_API_URL` in your frontend environment variables to point to your backend URL.

## ✅ Step 9: Test Deployment

1. **Backend Test**: Visit `https://your-backend.vercel.app/`
2. **Frontend Test**: Visit `https://your-frontend.vercel.app/`
3. **API Test**: Test endpoints like `/api/health` and `/api/users/test`

## 🛠️ Troubleshooting

### Common Issues & Solutions

#### 1. Build Errors
```bash
# Check build logs
vercel logs

# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
```

#### 2. Environment Variables Not Working
- Ensure variables are set in the correct project
- Check variable names match exactly
- Redeploy after adding variables

#### 3. CORS Errors
- Backend CORS is configured for common Vercel domains
- Check if frontend URL is correct in backend CORS settings
- Update `FRONTEND_URL` environment variable

#### 4. MongoDB Connection Issues
- Verify MongoDB Atlas connection string
- Check network access settings in MongoDB Atlas
- Ensure IP whitelist includes Vercel's IPs

#### 5. Clerk Authentication Issues
- Verify Clerk keys are correct
- Check Clerk dashboard for any configuration issues
- Ensure frontend and backend use the same Clerk application

### Debug Commands

```bash
# View deployment logs
vercel logs

# Check deployment status
vercel ls

# Redeploy specific project
vercel --prod

# Remove project
vercel remove
```

## 🔍 Environment Variables Reference

### Backend Required Variables
| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://...` |
| `CLERK_SECRET_KEY` | Clerk backend secret key | `sk_test_...` |
| `JWT_SECRET` | JWT signing secret | `your-secret-key` |
| `EMAIL_USER` | Email for notifications | `your@email.com` |
| `EMAIL_PASS` | Email app password | `your-app-password` |
| `FRONTEND_URL` | Frontend Vercel URL | `https://frontend.vercel.app` |

### Frontend Required Variables
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://backend.vercel.app` |
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk frontend key | `pk_test_...` |

## 💰 Cost & Limits

### Vercel Free Tier
- **Functions**: 100 GB-hours/month
- **Bandwidth**: 100 GB/month
- **Builds**: 100 builds/month
- **Domains**: Custom domains supported

### MongoDB Atlas Free Tier
- **Storage**: 512 MB
- **Connections**: 500 connections

### Clerk Free Tier
- **Users**: 5,000 monthly active users
- **Sessions**: Unlimited

## 🎯 Next Steps After Deployment

1. **Set up custom domain** (optional)
2. **Configure monitoring and analytics**
3. **Set up CI/CD pipeline**
4. **Monitor performance and costs**
5. **Plan scaling strategy**

## 🆘 Need Help?

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **MongoDB Atlas**: [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)
- **Clerk Docs**: [clerk.com/docs](https://clerk.com/docs)
- **Project Issues**: Check GitHub issues or create new ones

---

**Your PayFlow application is now fully optimized for Vercel deployment! 🎉**

The code changes ensure:
- ✅ Serverless compatibility
- ✅ Production-ready configuration
- ✅ Environment variable support
- ✅ Optimized database connections
- ✅ Production CORS settings
- ✅ Health monitoring endpoints
