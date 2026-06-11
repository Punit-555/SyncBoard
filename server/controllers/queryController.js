import prisma from '../prisma.config.js';
import { sendQueryNotificationEmail, sendQueryReplyEmail } from '../services/emailService.js';

// Submit a contact query (public — used from Login/OTP screens and Help page)
export const submitQuery = async (req, res) => {
  try {
    const { name, email, subject, message, source } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, subject and message are required',
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address',
      });
    }

    const query = await prisma.contactQuery.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        subject: subject.trim(),
        message: message.trim(),
        source: source || 'help',
      },
    });

    // Notify all Super Admins by email (async, don't block the response)
    prisma.user
      .findMany({ where: { role: 'SUPERADMIN' }, select: { email: true } })
      .then((superAdmins) => {
        superAdmins.forEach((admin) => {
          sendQueryNotificationEmail(admin.email, query).catch((err) =>
            console.error(`❌ Failed to notify ${admin.email}:`, err.message)
          );
        });
      })
      .catch((err) => console.error('❌ Failed to fetch super admins:', err.message));

    return res.status(201).json({
      success: true,
      message: 'Your query has been submitted. Our team will get back to you soon.',
      data: { id: query.id },
    });
  } catch (error) {
    console.error('Submit query error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error submitting query',
      error: error.message,
    });
  }
};

// Get all queries (SuperAdmin only)
export const getQueries = async (req, res) => {
  try {
    const queries = await prisma.contactQuery.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json({
      success: true,
      data: queries,
    });
  } catch (error) {
    console.error('Get queries error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching queries',
      error: error.message,
    });
  }
};

// Update query status (SuperAdmin only)
export const updateQueryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['open', 'read', 'replied'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be one of: open, read, replied',
      });
    }

    const query = await prisma.contactQuery.update({
      where: { id },
      data: { status },
    });

    return res.status(200).json({
      success: true,
      message: 'Query status updated',
      data: query,
    });
  } catch (error) {
    console.error('Update query error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error updating query',
      error: error.message,
    });
  }
};

// Reply to a query via email (SuperAdmin only)
export const replyToQuery = async (req, res) => {
  try {
    const { id } = req.params;
    const { replyMessage } = req.body;

    if (!replyMessage || !replyMessage.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Reply message is required',
      });
    }

    const query = await prisma.contactQuery.findUnique({ where: { id } });

    if (!query) {
      return res.status(404).json({
        success: false,
        message: 'Query not found',
      });
    }

    await sendQueryReplyEmail(query.email, query.name, query, replyMessage.trim());

    const updated = await prisma.contactQuery.update({
      where: { id },
      data: { status: 'replied' },
    });

    return res.status(200).json({
      success: true,
      message: `Reply sent to ${query.email}`,
      data: updated,
    });
  } catch (error) {
    console.error('Reply to query error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error sending reply',
      error: error.message,
    });
  }
};

// Delete a query (SuperAdmin only)
export const deleteQuery = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.contactQuery.delete({ where: { id } });

    return res.status(200).json({
      success: true,
      message: 'Query deleted',
    });
  } catch (error) {
    console.error('Delete query error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error deleting query',
      error: error.message,
    });
  }
};
