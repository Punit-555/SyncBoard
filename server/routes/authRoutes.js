import express from 'express';
import { signup, login, getCurrentUser, forgotPassword, validateResetToken, resetPassword } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

// Password Reset Routes
router.post('/forgot-password', forgotPassword);
router.post('/validate-reset-token', validateResetToken);
router.post('/reset-password', resetPassword);

router.get('/me', authenticateToken, getCurrentUser);

export default router;
