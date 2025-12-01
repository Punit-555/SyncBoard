import express from 'express';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from '../controllers/taskController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all tasks for the authenticated user
router.get('/', getTasks);

// Get a single task by ID
router.get('/:id', getTaskById);

// Create a new task
router.post('/', createTask);

// Update a task
router.put('/:id', updateTask);

// Delete a task
router.delete('/:id', deleteTask);

export default router;
