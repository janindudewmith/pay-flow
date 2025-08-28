# 🚀 PayFlow Vercel Deployment Checklist

## ✅ Pre-Deployment Setup

- [ ] **Vercel Account Created** - [vercel.com/signup](https://vercel.com/signup)
- [ ] **MongoDB Atlas Account Created** - [mongodb.com/atlas](https://mongodb.com/atlas)
- [ ] **Clerk Account Created** - [clerk.com](https://clerk.com)
- [ ] **Vercel CLI Installed** - `npm install -g vercel`
- [ ] **Environment Files Created** - See `env.example` files

## 🔧 Backend Deployment

- [ ] **Navigate to Backend Directory** - `cd backend`
- [ ] **Create .env File** - Copy from `env.example` and fill in your values
- [ ] **Deploy Backend** - `vercel --prod`
- [ ] **Note Backend URL** - Copy the deployed URL
- [ ] **Set Environment Variables** - In Vercel dashboard for backend project

## 🌐 Frontend Deployment

- [ ] **Navigate to Frontend Directory** - `cd frontend`
- [ ] **Create .env File** - Copy from `env.example` and fill in your values
- [ ] **Update VITE_API_URL** - Set to your backend Vercel URL
- [ ] **Deploy Frontend** - `vercel --prod`
- [ ] **Set Environment Variables** - In Vercel dashboard for frontend project

## 🔑 Required Environment Variables

### Backend (.env)
- [ ] `MONGODB_URI` - MongoDB Atlas connection string
- [ ] `CLERK_SECRET_KEY` - Clerk backend secret key
- [ ] `JWT_SECRET` - JWT signing secret
- [ ] `EMAIL_USER` - Email for notifications
- [ ] `EMAIL_PASS` - Email app password
- [ ] `FRONTEND_URL` - Frontend Vercel URL
- [ ] `NODE_ENV` - Set to "production"

### Frontend (.env)
- [ ] `VITE_API_URL` - Backend Vercel URL
- [ ] `VITE_CLERK_PUBLISHABLE_KEY` - Clerk frontend key
- [ ] `VITE_NODE_ENV` - Set to "production"

## 🧪 Testing

- [ ] **Backend Health Check** - Visit `/api/health` endpoint
- [ ] **Frontend Loads** - Check if React app loads correctly
- [ ] **API Connection** - Test if frontend can connect to backend
- [ ] **Authentication** - Test Clerk login functionality
- [ ] **Database Connection** - Verify MongoDB Atlas connection

## 📝 Post-Deployment

- [ ] **Update Documentation** - Note the deployed URLs
- [ ] **Test All Features** - Go through main application flows
- [ ] **Monitor Logs** - Check Vercel function logs for errors
- [ ] **Set Up Monitoring** - Consider adding error tracking
- [ ] **Backup Configuration** - Save your environment variables

## 🆘 If Something Goes Wrong

- [ ] **Check Vercel Logs** - `vercel logs`
- [ ] **Verify Environment Variables** - Ensure all are set correctly
- [ ] **Check MongoDB Atlas** - Verify connection string and network access
- [ ] **Check Clerk Dashboard** - Ensure keys are correct
- [ ] **Redeploy if Needed** - `vercel --prod`

---

**Deployment Status**: ⏳ Not Started / ✅ Complete

**Backend URL**: `https://________________.vercel.app`

**Frontend URL**: `https://________________.vercel.app`

**Last Updated**: ________________
