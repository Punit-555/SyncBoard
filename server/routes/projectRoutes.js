import express from 'express';
import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/projectController.js';
import { authenticateToken, authorizeRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all projects (all authenticated users)
router.get('/', getAllProjects);

// Get a single project by ID (all authenticated users)
router.get('/:id', getProjectById);

// Create a new project (Admin/SuperAdmin only)
router.post('/', authorizeRole('ADMIN', 'SUPERADMIN'), createProject);

// Update a project (Admin/SuperAdmin only)
router.put('/:id', authorizeRole('ADMIN', 'SUPERADMIN'), updateProject);

// Delete a project (Admin/SuperAdmin only)
router.delete('/:id', authorizeRole('ADMIN', 'SUPERADMIN'), deleteProject);

export default router;
