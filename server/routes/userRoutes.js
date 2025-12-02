import express from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  uploadProfilePicture,
  deleteProfilePicture,
} from '../controllers/userController.js';
import { authenticateToken, authorizeRole } from '../middleware/authMiddleware.js';
import upload from '../config/multer.config.js';

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

// Profile picture routes - accessible to all authenticated users for their own profile
router.post('/profile-picture', upload.single('profilePicture'), uploadProfilePicture);
router.delete('/profile-picture', deleteProfilePicture);

export default router;
