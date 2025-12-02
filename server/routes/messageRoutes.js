import express from 'express';
import {
  getConversations,
  getMessages,
  sendMessage,
  deleteMessage,
  markAsRead,
  getUnreadCount,
} from '../controllers/messageController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import uploadMessageAttachment from '../config/messageAttachment.multer.config.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all conversations
router.get('/conversations', getConversations);

// Get unread count (must come before /:otherUserId to avoid 404)
router.get('/unread/count', getUnreadCount);

// Send a message (with optional file attachments)
router.post('/', uploadMessageAttachment.array('attachments', 5), sendMessage);

// Get messages with a specific user (must come after specific routes)
router.get('/:otherUserId', getMessages);

// Delete a message
router.delete('/:id', deleteMessage);

// Mark message as read
router.patch('/:id/read', markAsRead);

export default router;
