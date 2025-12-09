# 🚀 Vercel Deployment Guide for SyncBoard Backend

## ⚠️ Important Note About Vercel

Vercel is primarily designed for **serverless functions** and **frontend applications**. For a full backend with database connections, **Render or Railway** is recommended. However, if you want to use Vercel, follow this guide.

---

## 📋 Prerequisites

1. ✅ MongoDB Atlas account with connection string
2. ✅ GitHub repository with your backend code
3. ✅ Vercel account (free tier works)

---

## 🔧 Environment Variables for Vercel

You'll need to add these in Vercel Dashboard:

```env
DATABASE_URL=mongodb+srv://Punit:Punit123@cluster0.cuanqw2.mongodb.net/syncboard_db?retryWrites=true&w=majority
JWT_SECRET=taskflow_jwt_secret_key_change_in_production_2024
EMAIL_USER=codesharma452@gmail.com
EMAIL_PASS=rzmt kpaz oxgy pmco
CLIENT_URL=https://your-frontend.vercel.app
NODE_ENV=production
```

---

## 📝 Step-by-Step Deployment

### 1. Install Vercel CLI (Optional, for local testing)

```bash
npm install -g vercel
```

### 2. Login to Vercel

```bash
vercel login
```

### 3. Deploy via Vercel Dashboard (Recommended)

#### A. Connect Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. **Import Git Repository** → Select your backend repo
4. Click **"Import"**

#### B. Configure Project

**Framework Preset:** Other

**Root Directory:** `server` (if backend is in server folder, otherwise leave as `.`)

**Build & Development Settings:**
- **Build Command:** `npm install && npx prisma generate`
- **Output Directory:** Leave empty
- **Install Command:** `npm install`
- **Development Command:** `npm run dev`

#### C. Add Environment Variables

In the **Environment Variables** section, add all variables from above.

**Important:** Make sure to add them for:
- ✅ Production
- ✅ Preview
- ✅ Development

#### D. Deploy

Click **"Deploy"** and wait for deployment to complete (2-5 minutes)

---

### 4. Alternative: Deploy via CLI

```bash
cd /home/qss/Desktop/Proj/server

# First deployment
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name: syncboard-backend
# - Directory: ./
# - Build settings: detected automatically

# Production deployment
vercel --prod
```

---

## 🗄️ Initialize Database (One-Time Setup)

After deployment, you need to create users and projects. You have two options:

### Option 1: Using Vercel CLI

```bash
# Connect to your deployment
vercel env pull

# Run the setup script locally (it will connect to MongoDB Atlas)
node createAllUsers.js
```

### Option 2: Create a Temporary Setup Endpoint (Not Recommended for Production)

Add this to your `app.js` temporarily:

```javascript
// Temporary setup endpoint - REMOVE AFTER FIRST USE
app.get('/api/setup', async (req, res) => {
  try {
    const createAllUsers = (await import('./createAllUsers.js')).default;
    await createAllUsers();
    res.json({ success: true, message: 'Database initialized!' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

Then visit: `https://your-app.vercel.app/api/setup`

**⚠️ IMPORTANT: Remove this endpoint after running once!**

---

## 🧪 Testing Your Deployment

### 1. Health Check

```bash
curl https://your-app.vercel.app/health
```

Expected response:
```json
{"status":"Server is running"}
```

### 2. Login Test

```bash
curl -X POST https://your-app.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@taskflow.com","password":"Admin@123"}'
```

Expected: JWT token in response

### 3. Get Current User Test

```bash
curl -X GET https://your-app.vercel.app/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 👥 Pre-configured Users

After running `createAllUsers.js`, these accounts will be available:

| Email | Password | Role |
|-------|----------|------|
| codesharma452@gmail.com | Code@123 | USER |
| Puneet.sharma@qsstechnosoft.com | Puneet@123 | ADMIN |
| developerpunit9628@gmail.com | Developer@123 | SUPERADMIN |
| admin@taskflow.com | Admin@123 | ADMIN |
| superadmin@taskflow.com | SuperAdmin@123 | SUPERADMIN |

---

## ⚠️ Vercel Limitations for Backends

### Free Tier Limits:
- **Serverless Function Timeout:** 10 seconds (upgradable to 60s on Pro)
- **Deployment Size:** 250MB max
- **Bandwidth:** 100GB/month
- **Serverless Function Size:** 50MB max

### Important Considerations:

1. **Database Connections:**
   - Vercel uses serverless functions
   - Each request creates a new connection
   - Use connection pooling
   - MongoDB Atlas handles this well

2. **Cold Starts:**
   - First request may be slow (1-3 seconds)
   - Subsequent requests are faster

3. **File Uploads:**
   - Limited support for file storage
   - Use external storage (AWS S3, Cloudinary)

4. **WebSockets:**
   - Not supported on Vercel
   - Use alternative real-time solutions

---

## 🔧 Troubleshooting

### Issue: "Module not found" error

**Solution:** Ensure `package.json` has correct `type: "module"` and all imports use `.js` extensions

### Issue: Prisma Client not generated

**Solution:** Add build script:
```json
"scripts": {
  "build": "npx prisma generate",
  "postinstall": "npx prisma generate"
}
```

### Issue: Database connection timeout

**Solution:**
1. Check MongoDB Atlas network access allows `0.0.0.0/0`
2. Verify DATABASE_URL is correct
3. Check connection string format

### Issue: Environment variables not working

**Solution:**
1. Redeploy after adding env vars
2. Check they're added for Production
3. Restart deployment

---

## 🎯 Recommended: Use Render Instead

For production backends, consider using **Render.com** instead of Vercel because:

✅ Better suited for long-running processes
✅ Persistent servers (not serverless)
✅ Better WebSocket support
✅ No serverless function timeout
✅ Easier database connections
✅ Free tier includes always-on option

See [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md) for Render deployment guide.

---

## 📞 Support & Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel CLI Reference](https://vercel.com/docs/cli)
- [Prisma with Vercel](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)

---

## ✅ Deployment Checklist

Before deploying:
- [x] MongoDB Atlas cluster created
- [x] `vercel.json` file created
- [x] All environment variables documented
- [x] Code pushed to GitHub
- [x] Prisma schema is for MongoDB

After deploying:
- [ ] Visit health endpoint
- [ ] Run createAllUsers.js
- [ ] Test login API
- [ ] Test protected routes
- [ ] Update CLIENT_URL with frontend URL

---

**Last Updated:** 2025-12-09
**Status:** ✅ Ready for Vercel Deployment
**Recommendation:** Use Render for better backend support
