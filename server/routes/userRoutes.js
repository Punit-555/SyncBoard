import express from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/userController.js';
import { authenticateToken, authorizeRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication and admin/superadmin role
router.use(authenticateToken);
router.use(authorizeRole('ADMIN', 'SUPERADMIN'));

// Get all users
router.get('/', getAllUsers);

// Get a single user by ID
router.get('/:id', getUserById);

// Create a new user
router.post('/', createUser);

// Update a user
router.put('/:id', updateUser);

// Delete a user
router.delete('/:id', deleteUser);

export default router;
