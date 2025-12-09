import prisma from '../prisma.config.js';
import path from 'path';
import fs from 'fs';

// Get all conversations for the authenticated user
export const getConversations = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get all unique users the current user has messaged with
    const sentMessages = await prisma.message.findMany({
      where: { senderId: userId },
      select: { receiverId: true },
      distinct: ['receiverId'],
    });

    const receivedMessages = await prisma.message.findMany({
      where: { receiverId: userId },
      select: { senderId: true },
      distinct: ['senderId'],
    });

    // Combine and get unique user IDs
    const userIds = new Set([
      ...sentMessages.map((m) => m.receiverId),
      ...receivedMessages.map((m) => m.senderId),
    ]);

    // Get user details and last message for each conversation
    const conversations = await Promise.all(
      Array.from(userIds).map(async (otherUserId) => {
        const lastMessage = await prisma.message.findFirst({
          where: {
            OR: [
              { senderId: userId, receiverId: otherUserId },
              { senderId: otherUserId, receiverId: userId },
            ],
          },
          orderBy: { createdAt: 'desc' },
          include: {
            attachments: true,
          },
        });

        const unreadCount = await prisma.message.count({
          where: {
            senderId: otherUserId,
            receiverId: userId,
            isRead: false,
          },
        });

        const user = await prisma.user.findUnique({
          where: { id: otherUserId },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            profilePicture: true,
            role: true,
          },
        });

        return {
          user,
          lastMessage,
          unreadCount,
        };
      })
    );

    // Sort by last message time
    conversations.sort((a, b) => {
      const timeA = a.lastMessage?.createdAt || 0;
      const timeB = b.lastMessage?.createdAt || 0;
      return new Date(timeB) - new Date(timeA);
    });

    return res.status(200).json({
      success: true,
      data: conversations,
    });
  } catch (error) {
    console.error('Get conversations error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching conversations',
      error: error.message,
    });
  }
};

// Get messages between two users
export const getMessages = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { otherUserId } = req.params;
    const otherUserIdInt = otherUserId;

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: otherUserIdInt },
          { senderId: otherUserIdInt, receiverId: userId },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            profilePicture: true,
          },
        },
        receiver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            profilePicture: true,
          },
        },
        attachments: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    // Mark messages as read
    await prisma.message.updateMany({
      where: {
        senderId: otherUserIdInt,
        receiverId: userId,
        isRead: false,
      },
      data: { isRead: true },
    });

    return res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    console.error('Get messages error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching messages',
      error: error.message,
    });
  }
};

// Send a message
export const sendMessage = async (req, res) => {
  try {
    const senderId = req.user.userId;
    const { receiverId, content } = req.body;

    if (!receiverId) {
      return res.status(400).json({
        success: false,
        message: 'Receiver ID is required',
      });
    }

    // Check if receiver exists
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
    });

    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: 'Receiver not found',
      });
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        content: content || null,
        senderId,
        receiverId: receiverId,
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            profilePicture: true,
          },
        },
        receiver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            profilePicture: true,
          },
        },
        attachments: true,
      },
    });

    // Handle file uploads if present
    if (req.files && req.files.length > 0) {
      const attachments = await Promise.all(
        req.files.map(async (file) => {
          return prisma.messageAttachment.create({
            data: {
              messageId: message.id,
              fileName: file.originalname,
              fileUrl: `/uploads/message-attachments/${file.filename}`,
              fileType: file.mimetype,
              fileSize: file.size,
            },
          });
        })
      );

      message.attachments = attachments;
    }

    return res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: message,
    });
  } catch (error) {
    console.error('Send message error:', error);

    // Clean up uploaded files if message creation failed
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        const filePath = path.join(process.cwd(), 'uploads', 'message-attachments', file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Server error sending message',
      error: error.message,
    });
  }
};

// Delete a message
export const deleteMessage = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const message = await prisma.message.findUnique({
      where: { id: parseInt(id) },
      include: { attachments: true },
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found',
      });
    }

    // Only sender can delete their message
    if (message.senderId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own messages',
      });
    }

    // Delete attachments files
    if (message.attachments && message.attachments.length > 0) {
      message.attachments.forEach((attachment) => {
        const filePath = path.join(process.cwd(), attachment.fileUrl);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }

    // Delete message (attachments will be deleted by cascade)
    await prisma.message.delete({
      where: { id: parseInt(id) },
    });

    return res.status(200).json({
      success: true,
      message: 'Message deleted successfully',
    });
  } catch (error) {
    console.error('Delete message error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error deleting message',
      error: error.message,
    });
  }
};

// Mark message as read
export const markAsRead = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const message = await prisma.message.findUnique({
      where: { id: parseInt(id) },
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found',
      });
    }

    // Only receiver can mark as read
    if (message.receiverId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only mark your own received messages as read',
      });
    }

    await prisma.message.update({
      where: { id: parseInt(id) },
      data: { isRead: true },
    });

    return res.status(200).json({
      success: true,
      message: 'Message marked as read',
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error marking message as read',
      error: error.message,
    });
  }
};

// Get unread count
export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.userId;

    const unreadCount = await prisma.message.count({
      where: {
        receiverId: userId,
        isRead: false,
      },
    });

    return res.status(200).json({
      success: true,
      data: { unreadCount },
    });
  } catch (error) {
    console.error('Get unread count error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching unread count',
      error: error.message,
    });
  }
};
