# 📡 API Reference & Example Responses

## Overview
All endpoints return JSON responses with consistent format.

---

## 1️⃣ POST /api/auth/signup

Create a new user account and send welcome email.

### Request
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePassword123!",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Success Response (201)
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "USER"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiam9obkBleGFtcGxlLmNvbSIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzAxMDk2MTAwLCJleHAiOjE3MDE3MDA5MDB9.abc123..."
}
```

### Validation Errors

**Missing email/password (400)**
```json
{
  "success": false,
  "message": "Email and password are required"
}
```

**User already exists (409)**
```json
{
  "success": false,
  "message": "User with this email already exists"
}
```

### What Happens
- ✅ Email is validated
- ✅ Checks if user already exists
- ✅ Password is hashed with bcrypt
- ✅ User created in database
- ✅ **Beautiful welcome email is sent**
- ✅ JWT token is generated
- ✅ Response with user data & token

---

## 2️⃣ POST /api/auth/login

Authenticate user with email and password.

### Request
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePassword123!"
  }'
```

### Success Response (200)
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "id": 1,
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "USER"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiam9obkBleGFtcGxlLmNvbSIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzAxMDk2MTAwLCJleHAiOjE3MDE3MDA5MDB9.abc123..."
}
```

### Validation Errors

**Missing credentials (400)**
```json
{
  "success": false,
  "message": "Email and password are required"
}
```

**Invalid credentials (401)**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

### Token Info
```javascript
{
  "userId": 1,
  "email": "john@example.com",
  "role": "USER",
  "iat": 1701096100,        // Issued at
  "exp": 1701700900         // Expires in 7 days
}
```

---

## 3️⃣ GET /api/auth/me

Get authenticated user's profile (protected route).

### Request
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Success Response (200)
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "USER",
    "createdAt": "2025-11-27T07:30:00.000Z"
  }
}
```

### Authentication Errors

**Missing token (401)**
```json
{
  "success": false,
  "message": "Access token required"
}
```

**Invalid token (403)**
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

**User not found (404)**
```json
{
  "success": false,
  "message": "User not found"
}
```

---

## Token Usage

### Store Token
After signup/login, save the token:
```javascript
localStorage.setItem('token', response.token);
```

### Use Token in Requests
```javascript
fetch('/api/auth/me', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});
```

### Token Format
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
                      ↑ Always include "Bearer "
```

---

## HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | Success | Login successful |
| 201 | Created | User signup successful |
| 400 | Bad Request | Missing email/password |
| 401 | Unauthorized | Invalid credentials, missing token |
| 403 | Forbidden | Expired/invalid token |
| 404 | Not Found | User not found |
| 409 | Conflict | User already exists |
| 500 | Server Error | Database error, email error |

---

## Error Handling

All error responses follow format:
```json
{
  "success": false,
  "message": "Human-readable error message",
  "error": "Technical details (development only)"
}
```

---

## Common Scenarios

### Scenario 1: New User Signs Up
```bash
# 1. User submits signup form
POST /api/auth/signup
{
  "email": "newuser@example.com",
  "password": "Pass123!",
  "firstName": "Jane",
  "lastName": "Smith"
}

# 2. Response includes:
# - User created (id=2)
# - JWT token
# - Email sent to newuser@example.com

# 3. Client stores token
localStorage.setItem('token', 'eyJ...')

# 4. Frontend redirects to dashboard
```

### Scenario 2: User Logs In
```bash
# 1. User submits login form
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}

# 2. Response includes:
# - User data
# - New JWT token

# 3. Client stores token and redirects
```

### Scenario 3: Access Protected Route
```bash
# 1. Get user profile (authenticated)
GET /api/auth/me
Headers: Authorization: Bearer <token>

# 2. Middleware verifies token
# 3. Returns user data if valid
# 4. Returns 401/403 if invalid/expired
```

---

## Rate Limiting (Future)

Coming soon:
- Max 5 signup attempts per IP per 15 minutes
- Max 10 login attempts per email per 15 minutes
- Max 100 requests per token per hour

---

## CORS Headers

The server accepts requests from:
- `http://localhost:5173` (React Vite app)
- Add more origins in `app.js` CORS config

---

## Health Check

Test if server is running:
```bash
curl http://localhost:5000/health

Response:
{
  "status": "Server is running"
}
```

---

## Example Frontend Integration

### React Hook for Signup
```javascript
const useSignup = () => {
  const signup = async (email, password, firstName, lastName) => {
    const response = await fetch('http://localhost:5000/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, firstName, lastName })
    });
    
    const data = await response.json();
    
    if (data.success) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.data));
      return data;
    } else {
      throw new Error(data.message);
    }
  };
  
  return { signup };
};
```

### React Hook for Login
```javascript
const useLogin = () => {
  const login = async (email, password) => {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (data.success) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.data));
      return data;
    } else {
      throw new Error(data.message);
    }
  };
  
  return { login };
};
```

### React Hook for Get User
```javascript
const useGetUser = () => {
  const getUser = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No token found');
    }
    
    const response = await fetch('http://localhost:5000/api/auth/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const data = await response.json();
    
    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.message);
    }
  };
  
  return { getUser };
};
```

---

**Ready to integrate with your frontend! 🚀**
