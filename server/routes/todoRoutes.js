import express from 'express';
import { getTodos, createTodo, updateTodo, deleteTodo } from '../controllers/todoController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// All todo routes require auth; controller enforces strict ownership
router.use(authenticateToken);

router.get('/', getTodos);
router.post('/', createTodo);
router.put('/:id', updateTodo);
router.delete('/:id', deleteTodo);

export default router;
