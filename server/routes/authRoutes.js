import express from 'express';
import {
  signup,
  login,
  getCurrentUser,
  forgotPassword,
  validateResetToken,
  resetPassword,
  updateUserProfile,
  deleteAccount,
} from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

router.post('/forgot-password', forgotPassword);
router.post('/validate-reset-token', validateResetToken);
router.post('/reset-password', resetPassword);
router.put('/reset-password', resetPassword);

router.get('/me', authenticateToken, getCurrentUser);

router.put('/user-update', authenticateToken, updateUserProfile);

router.delete('/delete-account', authenticateToken, deleteAccount);

export default router;
