import express from 'express';
import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  removeUserFromProject,
} from '../controllers/projectController.js';
import { authenticateToken, authorizeRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getAllProjects);

// Get a single project by ID (all authenticated users)
router.get('/:id', getProjectById);

// Create a new project (Admin/SuperAdmin only)
router.post('/', authorizeRole('ADMIN', 'SUPERADMIN'), createProject);

// Update a project (Admin/SuperAdmin only)
router.put('/:id', authorizeRole('ADMIN', 'SUPERADMIN'), updateProject);

// Delete a project (Admin/SuperAdmin only)
router.delete('/:id', authorizeRole('ADMIN', 'SUPERADMIN'), deleteProject);

// Remove user from project (Admin/SuperAdmin only)
router.delete('/:projectId/users/:userId', authorizeRole('ADMIN', 'SUPERADMIN'), removeUserFromProject);

export default router;
