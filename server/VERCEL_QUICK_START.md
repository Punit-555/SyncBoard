# ⚡ Vercel Quick Start - SyncBoard Backend

## 🚀 Deploy in 5 Minutes

### Step 1: Environment Variables

Copy these to Vercel Dashboard → Settings → Environment Variables:

```
DATABASE_URL=mongodb+srv://Punit:Punit123@cluster0.cuanqw2.mongodb.net/syncboard_db?retryWrites=true&w=majority
JWT_SECRET=taskflow_jwt_secret_key_change_in_production_2024
EMAIL_USER=codesharma452@gmail.com
EMAIL_PASS=rzmt kpaz oxgy pmco
CLIENT_URL=https://your-frontend.vercel.app
NODE_ENV=production
```

### Step 2: Deploy

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. **Root Directory:** `server` (if backend is in server folder)
4. **Build Command:** Leave as default
5. Click **Deploy**

### Step 3: Initialize Database

After deployment, run locally:

```bash
# Pull environment variables
vercel env pull

# Create users and projects
node createAllUsers.js
```

### Step 4: Test

```bash
# Test health
curl https://your-app.vercel.app/health

# Test login
curl -X POST https://your-app.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@taskflow.com","password":"Admin@123"}'
```

---

## 📦 What's Included

✅ MongoDB Atlas (cloud database)
✅ 5 pre-configured users (USER, ADMIN, SUPERADMIN)
✅ 6 pre-seeded projects
✅ All API endpoints ready
✅ CORS configured
✅ Email service configured
✅ JWT authentication

---

## 🔑 Login Credentials

| Email | Password | Role |
|-------|----------|------|
| admin@taskflow.com | Admin@123 | ADMIN |
| superadmin@taskflow.com | SuperAdmin@123 | SUPERADMIN |
| Puneet.sharma@qsstechnosoft.com | Puneet@123 | ADMIN |
| codesharma452@gmail.com | Code@123 | USER |

---

## ⚠️ Important

- MongoDB Atlas must allow IP `0.0.0.0/0` (all IPs)
- Update `CLIENT_URL` after deploying frontend
- Run `createAllUsers.js` only once
- Vercel free tier has 10-second timeout limit

---

## 📞 Having Issues?

Check [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for detailed troubleshooting.

---

🎉 **That's it! Your backend is deployed!**
