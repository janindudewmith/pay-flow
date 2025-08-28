# 🚀 PayFlow Vercel Deployment Guide

## Quick Start

### Option 1: Automated Deployment (Recommended)
```bash
# On Windows
deploy.bat

# On Mac/Linux
chmod +x deploy.sh
./deploy.sh
```

### Option 2: Manual Deployment
Follow the detailed steps below.

## Prerequisites

1. **Vercel Account**: [Sign up here](https://vercel.com/signup)
2. **MongoDB Atlas**: [Set up here](https://mongodb.com/atlas)
3. **Clerk Account**: [Sign up here](https://clerk.com)
4. **Node.js & npm**: Latest LTS version

## Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

## Step 2: Prepare Environment Variables

### Backend (.env file in backend/ directory)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/payflow
CLERK_SECRET_KEY=sk_test_...
JWT_SECRET=your-super-secret-jwt-key
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
NODE_ENV=production
```

### Frontend (.env file in frontend/ directory)
```env
VITE_API_URL=https://your-backend-project.vercel.app
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

## Step 3: Deploy Backend

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

## Step 4: Deploy Frontend

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

## Step 5: Configure Environment Variables in Vercel

### Backend Project
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select `pay-flow-backend`
3. Go to **Settings** → **Environment Variables**
4. Add each variable from your backend `.env` file

### Frontend Project
1. Select `pay-flow-frontend`
2. Go to **Settings** → **Environment Variables**
3. Add each variable from your frontend `.env` file

## Step 6: Update Frontend API URL

After backend deployment, update `VITE_API_URL` in your frontend environment variables to point to your backend URL.

## Step 7: Test Deployment

1. **Backend Test**: Visit `https://your-backend.vercel.app/`
2. **Frontend Test**: Visit `https://your-frontend.vercel.app/`
3. **API Test**: Test a few endpoints like `/api/users/test`

## Troubleshooting

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
- Backend CORS is configured to allow all origins
- Check if frontend URL is correct in backend CORS settings

#### 4. MongoDB Connection Issues
- Verify MongoDB Atlas connection string
- Check network access settings in MongoDB Atlas
- Ensure IP whitelist includes Vercel's IPs

#### 5. Clerk Authentication Issues
- Verify Clerk keys are correct
- Check Clerk dashboard for any configuration issues

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

## Project Structure After Deployment

```
pay-flow/
├── backend/          # Serverless functions on Vercel
├── frontend/         # Static site on Vercel
├── vercel.json       # Root configuration
├── deploy.sh         # Linux/Mac deployment script
├── deploy.bat        # Windows deployment script
└── DEPLOYMENT.md     # This guide
```

## Environment Variables Reference

### Backend Required Variables
| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `CLERK_SECRET_KEY` | Clerk backend secret key | `sk_test_...` |
| `JWT_SECRET` | JWT signing secret | `your-secret-key` |

### Frontend Required Variables
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://backend.vercel.app` |
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk frontend key | `pk_test_...` |

## Cost & Limits

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

## Support & Resources

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **MongoDB Atlas**: [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)
- **Clerk Docs**: [clerk.com/docs](https://clerk.com/docs)
- **Project Issues**: Check GitHub issues or create new ones

## Next Steps

After successful deployment:
1. Set up custom domain (optional)
2. Configure monitoring and analytics
3. Set up CI/CD pipeline
4. Monitor performance and costs
5. Plan scaling strategy

---

**Need help?** Check the troubleshooting section or reach out to the development team.
