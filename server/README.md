# 🚀 syncBoard Backend - Complete Setup Guide

## ✅ What's Been Implemented

### Authentication System
- ✅ **User Registration (Signup)** - Create new accounts with email verification
- ✅ **User Login** - Secure login with JWT tokens (7-day expiration)
- ✅ **Role-Based Access** - User roles: USER (default), ADMIN, MANAGER
- ✅ **Password Hashing** - Bcrypt with 10 salt rounds
- ✅ **Protected Routes** - Get current user info with valid token
- ✅ **Beautiful Email Templates** - syncBoard branded welcome emails

### Database
- ✅ **PostgreSQL** - Database is synced and ready
- ✅ **Prisma ORM** - Type-safe database access
- ✅ **User Model** - Complete with timestamps and roles

---

## 📧 Email Setup (IMPORTANT!)

### Why Emails Aren't Sending?

Gmail requires an **Application-Specific Password**, not your regular password.

### 🔧 Quick Fix - 3 Steps:

#### Step 1: Enable 2-Factor Authentication
1. Go to: https://myaccount.google.com/security
2. Click "2-Step Verification"
3. Complete the setup (you'll need your phone)

#### Step 2: Create App Password
1. Go to: https://myaccount.google.com/apppasswords
2. Select:
   - **App:** Mail
   - **Device:** Windows Computer (or your device)
3. Click "Generate"
4. **Copy the 16-character password** (looks like: `xxxx xxxx xxxx xxxx`)

#### Step 3: Update .env
```env
EMAIL_USER=codesharma452@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx  ← Paste your 16-char password here
```

---

## 🧪 Test Email Setup

Run this command to verify everything works:

```bash
npm run test-email
```

You should see:
```
✅ Email Service Ready!
✅ Test Email Sent!
🎉 Everything is ready! Your email service is fully configured.
```

---

## 🚀 Running the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on: **http://localhost:5000**

---

## 📡 API Endpoints

### 1. **POST /api/auth/signup** - Create Account
Create a new user account

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "USER"
  },
  "token": "eyJhbGc..."
}
```

**What Happens:**
- ✅ User account is created in database
- ✅ Password is hashed with bcrypt
- ✅ Default role set to "USER"
- ✅ **Welcome email is sent** 📧
- ✅ JWT token is returned

---

### 2. **POST /api/auth/login** - Login
Authenticate user and get token

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "USER"
  },
  "token": "eyJhbGc..."
}
```

---

### 3. **GET /api/auth/me** - Get Current User
Get logged-in user details (Protected Route)

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "USER",
    "createdAt": "2025-11-27T07:30:00.000Z"
  }
}
```

---

## 🧪 Test with cURL

### Test Signup
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

### Test Protected Route (use token from signup/login)
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer eyJhbGc..."
```

---

## 📧 Email Template Features

The syncBoard welcome email includes:

- 🎨 **Beautiful Design** - Gradient purple theme matching syncBoard branding
- 📋 **Feature Highlights** - Shows what users can do
- 💡 **Pro Tips** - Productivity tips for new users
- 🔗 **Call-to-Action** - Direct link to login
- 📱 **Responsive** - Works perfectly on mobile devices
- 🎯 **Brand Consistency** - Matches app design language

---

## 🔒 Security Features

✅ **Password Security**
- Bcrypt hashing with 10 rounds
- Passwords never stored in plain text

✅ **JWT Authentication**
- 7-day token expiration
- Secure token verification

✅ **Database Security**
- Credentials in .env (never in code)
- PostgreSQL running locally

✅ **Email Security**
- App-specific passwords (not user password)
- Encrypted SMTP connection

---

## 📁 Project Structure

```
server/
├── app.js                     # Express server setup
├── package.json               # Dependencies
├── .env                       # Environment variables
├── prisma/
│   └── schema.prisma         # Database schema
├── prisma.config.js          # Prisma client setup
├── controllers/
│   └── authController.js     # Auth logic (signup, login)
├── routes/
│   └── authRoutes.js         # API routes
├── middleware/
│   └── authMiddleware.js     # JWT verification
├── services/
│   └── emailService.js       # Email sending
├── config/
│   └── firebase.js           # Firebase setup
├── test-email.js             # Email configuration test
├── EMAIL_SETUP.md            # Email configuration guide
└── README.md                 # This file
```

---

## 🐛 Troubleshooting

### Emails Not Sending?

**Error:** `Application-specific password required`
- ✅ You need an App Password, not your Gmail password
- See "Email Setup" section above

**Error:** `Invalid login`
- ✅ Check EMAIL_USER and EMAIL_PASS in .env
- ✅ Make sure EMAIL_PASS is the 16-character app password

### Server Won't Start?

```bash
# Check if port 5000 is in use
lsof -i :5000

# Kill process using port 5000
kill -9 <PID>

# Start again
npm start
```

### Database Connection Error?

```bash
# Check PostgreSQL is running
psql -U task_user -d task_manager_db

# Verify DATABASE_URL in .env
# Format: postgresql://user:password@localhost:5432/database
```

---

## 🎯 Next Steps

1. ✅ **Setup Email** (follow steps above)
2. ✅ **Test Email** (`npm run test-email`)
3. ✅ **Test Signup** (creates user + sends email)
4. ✅ **Test Login** (verify authentication works)
5. ✅ **Connect Frontend** (integrate with React app)

---

## 📚 Additional Resources

- **Prisma Docs:** https://www.prisma.io/docs/
- **JWT Guide:** https://jwt.io/introduction
- **Nodemailer Docs:** https://nodemailer.com/
- **Express API:** https://expressjs.com/
- **Gmail App Passwords:** https://support.google.com/accounts/answer/185833

---

## 💬 Support

If you face any issues:

1. Check the `.env` file for correct configuration
2. Run `npm run test-email` to verify email setup
3. Check server logs for error messages
4. Verify PostgreSQL is running
5. Make sure all dependencies are installed: `npm install`

---

**Happy coding! 🚀 syncBoard is ready to go!**
