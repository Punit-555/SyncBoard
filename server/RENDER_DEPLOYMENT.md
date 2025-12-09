# Render Deployment Guide for SyncBoard Backend

## Prerequisites
- MongoDB Atlas account with connection string
- GitHub repository with your code
- Render account (free tier works)

## Step 1: Prepare Environment Variables

You'll need these environment variables in Render:

```env
DATABASE_URL=mongodb+srv://Punit:Punit123@cluster0.cuanqw2.mongodb.net/syncboard_db?retryWrites=true&w=majority
JWT_SECRET=taskflow_jwt_secret_key_change_in_production_2024
EMAIL_USER=codesharma452@gmail.com
EMAIL_PASS=rzmt kpaz oxgy pmco
CLIENT_URL=https://your-frontend-url.vercel.app
PORT=5000
NODE_ENV=production
```

## Step 2: Deploy to Render

### 1. Create New Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select your backend repository

### 2. Configure Build Settings

- **Name:** `syncboard-backend` (or your choice)
- **Region:** Choose closest to you
- **Branch:** `main`
- **Root Directory:** `server` (if backend is in server folder)
- **Runtime:** `Node`
- **Build Command:** `npm install && npx prisma generate`
- **Start Command:** `npm start`

### 3. Add Environment Variables

In the Render dashboard, add all environment variables from Step 1.

**Important:** Update `CLIENT_URL` to your actual frontend URL after deploying frontend.

### 4. Advanced Settings

- **Auto-Deploy:** Yes (deploys on every git push)
- **Instance Type:** Free (or paid for better performance)

## Step 3: First Deployment

1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Once deployed, get your backend URL: `https://your-backend.onrender.com`

## Step 4: Initialize Database

After first deployment, run the setup script:

```bash
# SSH into Render or use Render Shell
node createAllUsers.js
```

Or it will run automatically on deployment if you use the `deploy` script.

## Step 5: Test Your Deployment

Test endpoints:

```bash
# Health check
curl https://your-backend.onrender.com/health

# Login test
curl -X POST https://your-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@taskflow.com","password":"Admin@123"}'
```

## User Accounts Created on Deployment

| Email | Password | Role |
|-------|----------|------|
| codesharma452@gmail.com | Code@123 | USER |
| Puneet.sharma@qsstechnosoft.com | Puneet@123 | ADMIN |
| developerpunit9628@gmail.com | Developer@123 | SUPERADMIN |
| admin@taskflow.com | Admin@123 | ADMIN |
| superadmin@taskflow.com | SuperAdmin@123 | SUPERADMIN |

## Troubleshooting

### Issue: Database connection failed
- Check DATABASE_URL is correct
- Verify MongoDB Atlas network access allows all IPs (0.0.0.0/0)
- Ensure database user credentials are correct

### Issue: Prisma client not generated
- Make sure `npx prisma generate` runs in build command
- Check Render build logs

### Issue: App crashes on startup
- Check Render logs for errors
- Verify all environment variables are set
- Ensure PORT is set correctly

## Continuous Deployment

Every time you push to your GitHub repository:
1. Render automatically builds the app
2. Runs `npm install`
3. Generates Prisma client
4. Starts the server

## Monitoring

- **Logs:** Available in Render dashboard
- **Metrics:** CPU, Memory usage visible in Render
- **Alerts:** Configure in Render settings

## Important Notes

1. **Free Tier Limitations:**
   - Apps spin down after 15 minutes of inactivity
   - First request after spin-down takes 30-60 seconds
   - Upgrade to paid plan for 24/7 uptime

2. **MongoDB Atlas:**
   - Ensure your cluster is in the same region as Render for best performance
   - M0 (free tier) is sufficient for development/testing

3. **Security:**
   - Change JWT_SECRET in production
   - Use strong passwords for admin accounts
   - Keep environment variables secret

## Success Checklist

- [ ] MongoDB Atlas cluster created
- [ ] All environment variables configured
- [ ] Repository connected to Render
- [ ] Build succeeds without errors
- [ ] Health endpoint responds
- [ ] Login API works
- [ ] Database has users and projects
- [ ] Frontend can connect to backend

---

🎉 **Your backend is now deployed and ready to use!**
