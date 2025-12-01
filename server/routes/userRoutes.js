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

// All routes require authentication
router.use(authenticateToken);

// GET routes - accessible to all authenticated users
router.get('/', getAllUsers);
router.get('/:id', getUserById);

// POST, PUT, DELETE routes - require admin/superadmin role
router.post('/', authorizeRole('ADMIN', 'SUPERADMIN'), createUser);
router.put('/:id', authorizeRole('ADMIN', 'SUPERADMIN'), updateUser);
router.delete('/:id', authorizeRole('ADMIN', 'SUPERADMIN'), deleteUser);

export default router;
