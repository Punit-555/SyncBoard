# TaskFlow API Collection

Base URL: `http://localhost:5000`

## Table of Contents
1. [Authentication APIs](#authentication-apis)
2. [User Management APIs](#user-management-apis)
3. [Password Reset APIs](#password-reset-apis)

---

## Authentication APIs

### 1. Signup (Register New User)
**Endpoint:** `POST /api/auth/signup`

**Description:** Create a new user account

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "rememberMe": false
}
```

**Response (Success - 201):**
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
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@gmail.com",
    "password": "admin@123",
    "firstName": "Punit",
    "lastName": "Sharma"
  }'
```

---

### 2. Login
**Endpoint:** `POST /api/auth/login`

**Description:** Login with existing credentials

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "rememberMe": false
}
```

**Response (Success - 200):**
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
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@gmail.com",
    "password": "admin@123"
  }'
```

---

## User Management APIs

### 3. Get Current User (Protected)
**Endpoint:** `GET /api/auth/me`

**Description:** Get logged-in user details

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "USER",
    "createdAt": "2025-12-01T05:39:42.000Z"
  }
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### 4. Update User Profile (Protected)
**Endpoint:** `PUT /api/auth/user-update`

**Description:** Update user's first name and last name

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "role": "USER"
  }
}
```

**cURL Example:**
```bash
curl -X PUT http://localhost:5000/api/auth/user-update \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Smith"
  }'
```

---

### 5. Delete Account (Protected)
**Endpoint:** `DELETE /api/auth/delete-account`

**Description:** Delete user account permanently

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Account deleted successfully. We have sent a confirmation email to your email address."
}
```

**cURL Example:**
```bash
curl -X DELETE http://localhost:5000/api/auth/delete-account \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Password Reset APIs

### 6. Forgot Password (Request Reset)
**Endpoint:** `POST /api/auth/forgot-password`

**Description:** Request a password reset link via email

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "If an account exists with that email, a password reset link has been sent."
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@gmail.com"
  }'
```

---

### 7. Validate Reset Token
**Endpoint:** `POST /api/auth/validate-reset-token`

**Description:** Validate if a password reset token is still valid

**Request Body:**
```json
{
  "token": "abc123resettoken456"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Token is valid"
}
```

**Response (Error - 400):**
```json
{
  "success": false,
  "message": "Invalid or expired reset token"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/auth/validate-reset-token \
  -H "Content-Type: application/json" \
  -d '{
    "token": "abc123resettoken456"
  }'
```

---

### 8. Reset Password
**Endpoint:** `POST /api/auth/reset-password` or `PUT /api/auth/reset-password`

**Description:** Reset password using the reset token

**Request Body:**
```json
{
  "token": "abc123resettoken456",
  "password": "newPassword123"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Password has been reset successfully"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "abc123resettoken456",
    "password": "newPassword123"
  }'
```

---

## Health Check

### Server Health
**Endpoint:** `GET /health`

**Description:** Check if server is running

**Response (Success - 200):**
```json
{
  "status": "Server is running"
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:5000/health
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Email and password are required"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Route not found"
}
```

### 409 Conflict
```json
{
  "success": false,
  "message": "User with this email already exists"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Detailed error message (in development mode)"
}
```

---

## Testing Workflow

### 1. Create User
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gmail.com","password":"admin@123","firstName":"Punit","lastName":"Sharma"}'
```

### 2. Login and Get Token
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gmail.com","password":"admin@123"}'
```

Copy the `token` from the response.

### 3. Get User Info (Replace YOUR_TOKEN)
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 4. Update Profile
```bash
curl -X PUT http://localhost:5000/api/auth/user-update \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Updated","lastName":"Name"}'
```

---

## Notes

- All protected routes require `Authorization: Bearer TOKEN` header
- Tokens expire after 7 days (or 30 days with `rememberMe: true`)
- Email functionality requires proper EMAIL_USER and EMAIL_PASS in .env
- Password must be at least 6 characters for reset

---

**Server Status:** ✅ Running on http://localhost:5000
**Database:** ✅ Connected to task_manager_db
**Email Service:** ✅ Ready
