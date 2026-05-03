# 🚀 Deploy to Render & Vercel - Quick Guide

## ✅ GitHub Push Complete!

Your code has been successfully pushed to GitHub:
- **Repository**: https://github.com/prakashkchaudhary/new-koshi-a-c
- **Branch**: master
- **Commit**: feat: implement exact seat layout (1+1|2) with sleeper berths

---

## 🔧 Deploy Backend to Render

### Option 1: Auto-Deploy (Recommended)

Render will automatically detect the push and deploy if you have auto-deploy enabled.

**Check Deployment Status:**
1. Go to https://dashboard.render.com
2. Find your backend service
3. Check the "Events" tab for deployment progress
4. Wait for "Deploy live" status (usually 2-5 minutes)

### Option 2: Manual Deploy

If auto-deploy is not enabled:

1. Go to https://dashboard.render.com
2. Select your backend service
3. Click **"Manual Deploy"** → **"Deploy latest commit"**
4. Wait for deployment to complete

### Verify Backend Deployment

Once deployed, test your backend:
```bash
# Replace with your Render backend URL
curl https://your-backend-name.onrender.com/api/buses
```

**Expected Response**: JSON with buses list

---

## 🌐 Deploy Frontend to Vercel

### Option 1: Auto-Deploy (Recommended)

Vercel will automatically detect the GitHub push and deploy.

**Check Deployment Status:**
1. Go to https://vercel.com/dashboard
2. Find your project
3. Check the "Deployments" tab
4. Wait for "Ready" status (usually 1-3 minutes)

### Option 2: Manual Deploy via CLI

```bash
# Install Vercel CLI (if not installed)
npm install -g vercel

# Navigate to frontend directory
cd bus-booking/frontend

# Deploy to production
vercel --prod
```

### Option 3: Manual Deploy via Dashboard

1. Go to https://vercel.com/dashboard
2. Select your project
3. Click **"Deployments"** tab
4. Click **"Redeploy"** on the latest deployment
5. Select **"Use existing Build Cache"** → **"Redeploy"**

---

## 🔗 Update Environment Variables

### Vercel Frontend Environment Variables

Make sure your frontend has the correct backend URL:

1. Go to Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
2. Update or add:
   ```
   REACT_APP_API_URL=https://your-backend-name.onrender.com/api
   ```
3. Click **"Save"**
4. Redeploy the frontend

### Render Backend Environment Variables

Verify your backend has these variables:

1. Go to Render Dashboard → Your Service → **Environment**
2. Check these variables exist:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   NODE_ENV=production
   PORT=5000
   ```

---

## ✅ Deployment Checklist

### Backend (Render)
- [ ] Code pushed to GitHub
- [ ] Render detected the push
- [ ] Build completed successfully
- [ ] Service is "Live"
- [ ] Environment variables are set
- [ ] MongoDB connection working
- [ ] API endpoints responding

### Frontend (Vercel)
- [ ] Code pushed to GitHub
- [ ] Vercel detected the push
- [ ] Build completed successfully
- [ ] Deployment is "Ready"
- [ ] Environment variables updated
- [ ] Frontend loads correctly
- [ ] API calls work (check browser console)

---

## 🧪 Test Your Deployment

### 1. Test Backend API

```bash
# Get all buses
curl https://your-backend-name.onrender.com/api/buses

# Health check (if you have one)
curl https://your-backend-name.onrender.com/health
```

### 2. Test Frontend

1. Open your Vercel URL: `https://your-project-name.vercel.app`
2. Check these features:
   - [ ] Homepage loads
   - [ ] Can view buses
   - [ ] Can see seat layout (1+1|2 configuration)
   - [ ] Sleeper berths show "berth" and "seep" labels
   - [ ] Can login/register
   - [ ] Can book seats
   - [ ] Admin panel works

### 3. Test Seat Layout

1. Go to admin panel
2. Edit a bus
3. Go to "Seat Layout" tab
4. Toggle sleeper mode on/off
5. Verify layout matches:
   ```
   C1      | J1   J2
   A    B  | KA   Kha
   C    D  | GA   GHA
   A1   A2 | B1   B2
   ...
   berth berth | berth berth  (when sleeper enabled)
   seep  seep  | seep  seep
   ```

---

## 🐛 Troubleshooting

### Backend Issues

**Build Failed:**
- Check Render logs for errors
- Verify `package.json` has correct scripts
- Check Node version compatibility

**Service Won't Start:**
- Check environment variables
- Verify MongoDB connection string
- Check Render logs for startup errors

**API Returns 500 Errors:**
- Check Render logs
- Verify MongoDB is accessible
- Check CORS settings

### Frontend Issues

**Build Failed:**
- Check Vercel build logs
- Verify `package.json` scripts
- Check for syntax errors

**Blank Page:**
- Check browser console for errors
- Verify `REACT_APP_API_URL` is set correctly
- Check if API is accessible

**API Calls Fail:**
- Check browser Network tab
- Verify backend URL in environment variables
- Check CORS settings on backend

---

## 📊 Deployment URLs

After deployment, your URLs will be:

**Backend (Render):**
```
https://your-backend-name.onrender.com
```

**Frontend (Vercel):**
```
https://your-project-name.vercel.app
```

**Custom Domain (if configured):**
```
https://yourdomain.com
```

---

## 🔄 Future Updates

To deploy future changes:

1. Make changes locally
2. Test locally
3. Commit changes:
   ```bash
   git add .
   git commit -m "your message"
   git push origin master
   ```
4. Render and Vercel will auto-deploy!

---

## 📞 Quick Links

- **GitHub Repo**: https://github.com/prakashkchaudhary/new-koshi-a-c
- **Render Dashboard**: https://dashboard.render.com
- **Vercel Dashboard**: https://vercel.com/dashboard
- **MongoDB Atlas**: https://cloud.mongodb.com

---

## ✅ Deployment Complete!

Once both services show "Live" (Render) and "Ready" (Vercel), your bus booking system with the exact seat layout is live and ready to use! 🎉

**New Features Live:**
- ✅ Custom 1+1|2 seat layout
- ✅ Exact seat IDs (C1, A, B, KA, Kha, GA, GHA, etc.)
- ✅ 8 sleeper berths at last 2 rows
- ✅ "berth" and "seep" labels
- ✅ Sleeper toggle in admin panel
- ✅ All booking features working

---

**Last Updated**: 2026-05-01
**Status**: 🚀 Ready for Production
