# API Documentation - Task Manager RBAC System

## Base URL
```
http://localhost:5000
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## Authentication Endpoints

### 1. Sign Up
**POST** `/api/auth/signup`

Create a new user account.

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
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 2. Login
**POST** `/api/auth/login`

Authenticate a user and receive a JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "rememberMe": false
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
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Sample Admin Credentials:**
- Email: `admin@taskflow.com`
- Password: `Admin@123`
- Role: ADMIN

**Sample SuperAdmin Credentials:**
- Email: `superadmin@taskflow.com`
- Password: `SuperAdmin@123`
- Role: SUPERADMIN

---

### 3. Get Current User
**GET** `/api/auth/me`

Get the currently authenticated user's information.

**Headers:**
```
Authorization: Bearer <token>
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
    "createdAt": "2025-12-01T12:00:00.000Z"
  }
}
```

---

### 4. Update User Profile
**PUT** `/api/auth/user-update`

Update the current user's profile information.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith"
}
```

**Response:**
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

---

### 5. Delete Account
**DELETE** `/api/auth/delete-account`

Delete the current user's account.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Account deleted successfully"
}
```

---

## User Management Endpoints (Admin/SuperAdmin Only)

### 1. Get All Users
**GET** `/api/users`

Retrieve a list of all users (Admin/SuperAdmin only).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "USER",
      "managerId": 2,
      "manager": {
        "id": 2,
        "firstName": "Jane",
        "lastName": "Manager",
        "email": "manager@example.com"
      },
      "projects": [
        {
          "id": 1,
          "project": {
            "id": 1,
            "name": "AI"
          }
        }
      ],
      "createdAt": "2025-12-01T12:00:00.000Z",
      "updatedAt": "2025-12-01T12:00:00.000Z"
    }
  ]
}
```

---

### 2. Get User by ID
**GET** `/api/users/:id`

Retrieve details of a specific user (Admin/SuperAdmin only).

**Headers:**
```
Authorization: Bearer <token>
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
    "managerId": 2,
    "manager": {
      "id": 2,
      "firstName": "Jane",
      "lastName": "Manager",
      "email": "manager@example.com"
    },
    "projects": [...],
    "tasks": [...],
    "createdAt": "2025-12-01T12:00:00.000Z",
    "updatedAt": "2025-12-01T12:00:00.000Z"
  }
}
```

---

### 3. Create User
**POST** `/api/users`

Create a new user (Admin can create USER, SuperAdmin can create any role).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "firstName": "New",
  "lastName": "User",
  "role": "USER",
  "managerId": 2,
  "projectIds": [1, 2, 3]
}
```

**Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": 5,
    "email": "newuser@example.com",
    "firstName": "New",
    "lastName": "User",
    "role": "USER",
    "managerId": 2,
    "createdAt": "2025-12-01T12:00:00.000Z"
  }
}
```

---

### 4. Update User
**PUT** `/api/users/:id`

Update an existing user (Admin/SuperAdmin only).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "firstName": "Updated",
  "lastName": "Name",
  "role": "ADMIN",
  "managerId": 3,
  "projectIds": [1, 2]
}
```

**Response:**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": 5,
    "email": "newuser@example.com",
    "firstName": "Updated",
    "lastName": "Name",
    "role": "ADMIN",
    "managerId": 3,
    "updatedAt": "2025-12-01T13:00:00.000Z"
  }
}
```

---

### 5. Delete User
**DELETE** `/api/users/:id`

Delete a user (Admin/SuperAdmin only).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

## Task Management Endpoints

### 1. Get All Tasks
**GET** `/api/tasks`

Retrieve tasks (Users see their own tasks, Admins see all tasks).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Implement authentication",
      "description": "Add JWT authentication to the API",
      "status": "pending",
      "priority": "high",
      "userId": 1,
      "managerId": 2,
      "projectId": 1,
      "dueDate": "2025-12-15T00:00:00.000Z",
      "user": {
        "id": 1,
        "firstName": "John",
        "lastName": "Doe",
        "email": "user@example.com"
      },
      "manager": {
        "id": 2,
        "firstName": "Jane",
        "lastName": "Manager",
        "email": "manager@example.com"
      },
      "project": {
        "id": 1,
        "name": "AI"
      },
      "createdAt": "2025-12-01T12:00:00.000Z",
      "updatedAt": "2025-12-01T12:00:00.000Z"
    }
  ]
}
```

---

### 2. Get Task by ID
**GET** `/api/tasks/:id`

Retrieve details of a specific task.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Implement authentication",
    "description": "Add JWT authentication to the API",
    "status": "pending",
    "priority": "high",
    "userId": 1,
    "managerId": 2,
    "projectId": 1,
    "dueDate": "2025-12-15T00:00:00.000Z",
    "user": {...},
    "manager": {...},
    "project": {...},
    "createdAt": "2025-12-01T12:00:00.000Z",
    "updatedAt": "2025-12-01T12:00:00.000Z"
  }
}
```

---

### 3. Create Task
**POST** `/api/tasks`

Create a new task.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "New Task",
  "description": "Task description",
  "status": "pending",
  "priority": "medium",
  "userId": 1,
  "managerId": 2,
  "projectId": 1,
  "dueDate": "2025-12-20T00:00:00.000Z"
}
```

**Note:** Regular users can only create tasks for themselves. Admins can create tasks for any user by specifying `userId`.

**Response:**
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "id": 2,
    "title": "New Task",
    "description": "Task description",
    "status": "pending",
    "priority": "medium",
    "userId": 1,
    "managerId": 2,
    "projectId": 1,
    "dueDate": "2025-12-20T00:00:00.000Z",
    "user": {...},
    "manager": {...},
    "project": {...},
    "createdAt": "2025-12-01T12:30:00.000Z",
    "updatedAt": "2025-12-01T12:30:00.000Z"
  }
}
```

---

### 4. Update Task
**PUT** `/api/tasks/:id`

Update an existing task.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Updated Task Title",
  "description": "Updated description",
  "status": "in-progress",
  "priority": "high",
  "managerId": 3,
  "projectId": 2,
  "dueDate": "2025-12-25T00:00:00.000Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": {
    "id": 2,
    "title": "Updated Task Title",
    "description": "Updated description",
    "status": "in-progress",
    "priority": "high",
    ...
  }
}
```

---

### 5. Delete Task
**DELETE** `/api/tasks/:id`

Delete a task.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

---

## Project Management Endpoints

### 1. Get All Projects
**GET** `/api/projects`

Retrieve projects (Users see assigned projects, Admins see all projects).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "AI",
      "description": "Artificial Intelligence and Machine Learning initiatives",
      "status": "active",
      "createdAt": "2025-12-01T12:00:00.000Z",
      "updatedAt": "2025-12-01T12:00:00.000Z",
      "_count": {
        "tasks": 5,
        "users": 3
      }
    }
  ]
}
```

---

### 2. Get Project by ID
**GET** `/api/projects/:id`

Retrieve details of a specific project.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "AI",
    "description": "Artificial Intelligence and Machine Learning initiatives",
    "status": "active",
    "tasks": [...],
    "users": [...],
    "createdAt": "2025-12-01T12:00:00.000Z",
    "updatedAt": "2025-12-01T12:00:00.000Z"
  }
}
```

---

### 3. Create Project (Admin/SuperAdmin Only)
**POST** `/api/projects`

Create a new project.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "New Project",
  "description": "Project description",
  "status": "active"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Project created successfully",
  "data": {
    "id": 7,
    "name": "New Project",
    "description": "Project description",
    "status": "active",
    "createdAt": "2025-12-01T12:00:00.000Z",
    "updatedAt": "2025-12-01T12:00:00.000Z"
  }
}
```

---

### 4. Update Project (Admin/SuperAdmin Only)
**PUT** `/api/projects/:id`

Update an existing project.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Updated Project Name",
  "description": "Updated description",
  "status": "completed"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Project updated successfully",
  "data": {
    "id": 7,
    "name": "Updated Project Name",
    "description": "Updated description",
    "status": "completed",
    "createdAt": "2025-12-01T12:00:00.000Z",
    "updatedAt": "2025-12-01T13:00:00.000Z"
  }
}
```

---

### 5. Delete Project (Admin/SuperAdmin Only)
**DELETE** `/api/projects/:id`

Delete a project.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Project deleted successfully"
}
```

---

## Role-Based Access Control

### User Roles

1. **USER**
   - Can view their own tasks
   - Can create, update, and delete their own tasks
   - Can view projects they are assigned to
   - Limited sidebar navigation

2. **ADMIN**
   - Can view all tasks
   - Can create, update, and delete any task
   - Can manage users (except other Admins/SuperAdmins)
   - Can manage projects
   - Can view and edit all users
   - Extended sidebar navigation

3. **SUPERADMIN**
   - All Admin permissions
   - Can manage Admin and SuperAdmin users
   - Can assign roles to users
   - Full access to all system features
   - Custom sidebar navigation

---

## Sample Projects

The following sample projects are seeded in the database:
1. AI - Artificial Intelligence and Machine Learning initiatives
2. ML - Machine Learning research and development
3. TaskFlow - Task management and workflow automation platform
4. SyncBoard - Real-time collaboration and synchronization board
5. DataViz - Data visualization and analytics platform
6. CloudOps - Cloud operations and infrastructure management

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Access token required"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Server error",
  "error": "Detailed error message (in development mode)"
}
```

---

## Testing the API

You can test the API using:
- **Postman**: Import the endpoints as a collection
- **cURL**: Use command-line requests
- **Insomnia**: REST API client
- **Thunder Client**: VS Code extension

### Example cURL Request:

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@taskflow.com","password":"Admin@123"}'

# Get all users (with token)
curl -X GET http://localhost:5000/api/users \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Create a task
curl -X POST http://localhost:5000/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Task",
    "description": "Task description",
    "projectId": 1,
    "priority": "high"
  }'
```

---

## Frontend Integration

The client application includes:
- Role-based sidebar navigation
- User management page (Admin/SuperAdmin only)
- Task management interface
- Project viewing and management

### Sidebar Navigation by Role:

**USER:**
- Dashboard, Projects, My Tasks, Teams, Calendar, Reports, Guide, Help & Support, Settings

**ADMIN:**
- Dashboard, Projects, Teams, Users, Reports, Guide, Settings

**SUPERADMIN:**
- Dashboard, Teams, Users, Calendar, Reports, Help & Support, Settings
