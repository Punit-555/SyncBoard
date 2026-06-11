import express from 'express';
import {
  submitQuery,
  getQueries,
  updateQueryStatus,
  replyToQuery,
  deleteQuery,
} from '../controllers/queryController.js';
import { authenticateToken, authorizeRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public — anyone can submit a query (Login / Security Code screens have no auth)
router.post('/', submitQuery);

// SuperAdmin only
router.get('/', authenticateToken, authorizeRole('SUPERADMIN'), getQueries);
router.put('/:id/status', authenticateToken, authorizeRole('SUPERADMIN'), updateQueryStatus);
router.post('/:id/reply', authenticateToken, authorizeRole('SUPERADMIN'), replyToQuery);
router.delete('/:id', authenticateToken, authorizeRole('SUPERADMIN'), deleteQuery);

export default router;
