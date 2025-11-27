import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import prisma from '../prisma.config.js';
import { sendSignupEmail, sendPasswordResetEmail } from '../services/emailService.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

const generateToken = (userId, email, role, rememberMe = false) => {
  const expiresIn = rememberMe ? '30d' : '7d';
  return jwt.sign(
    { userId, email, role },
    JWT_SECRET,
    { expiresIn }
  );
};

export const signup = async (req, res) => {
  try {
    const { email, password, firstName, lastName, rememberMe } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName: firstName || '',
        lastName: lastName || '',
        role: 'USER', 
      },
    });

    try {
      await sendSignupEmail(email, firstName || 'User');
    } catch (emailError) {
      console.error('Error sending signup email:', emailError);
    }

    const token = generateToken(user.id, user.email, user.role, rememberMe);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error('Signup error:', error);
    console.error('Error stack:', error.stack);
    return res.status(500).json({
      success: false,
      message: 'Server error during signup',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
    });
  }
};

// Login Controller
export const login = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Generate JWT token
    const token = generateToken(user.id, user.email, user.role, rememberMe);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message,
    });
  }
};

// Get current user (protected route example)
export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.userId; // From JWT middleware

    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Get user error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching user',
      error: error.message,
    });
  }
};

// Forgot Password - Request reset token
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Always return success to prevent email enumeration
    if (!user) {
      return res.status(200).json({
        success: true,
        message: 'If an account exists with that email, a password reset link has been sent.',
      });
    }

    // Generate secure random token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Token expires in 1 hour
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    // Delete any existing reset tokens for this user
    await prisma.passwordReset.deleteMany({
      where: { userId: user.id },
    });

    // Create new reset token
    await prisma.passwordReset.create({
      data: {
        userId: user.id,
        token: hashedToken,
        expiresAt,
      },
    });

    // Send password reset email
    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;

    try {
      await sendPasswordResetEmail(email, user.firstName || 'User', resetUrl);
    } catch (emailError) {
      console.error('Error sending password reset email:', emailError);
      // Don't fail the request if email fails
    }

    return res.status(200).json({
      success: true,
      message: 'If an account exists with that email, a password reset link has been sent.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during password reset request',
      error: error.message,
    });
  }
};

// Validate Reset Token
export const validateResetToken = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token is required',
      });
    }

    // Hash the token to compare with database
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find valid reset token
    const resetToken = await prisma.passwordReset.findFirst({
      where: {
        token: hashedToken,
        used: false,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!resetToken) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Token is valid',
    });
  } catch (error) {
    console.error('Validate token error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during token validation',
      error: error.message,
    });
  }
};

// Reset Password - Update password with token
export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: 'Token and new password are required',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    // Hash the token to compare with database
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find valid reset token
    const resetToken = await prisma.passwordReset.findFirst({
      where: {
        token: hashedToken,
        used: false,
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        user: true,
      },
    });

    if (!resetToken) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token',
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user password
    await prisma.user.update({
      where: { id: resetToken.userId },
      data: { password: hashedPassword },
    });

    // Mark token as used
    await prisma.passwordReset.update({
      where: { id: resetToken.id },
      data: { used: true },
    });

    return res.status(200).json({
      success: true,
      message: 'Password has been reset successfully',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during password reset',
      error: error.message,
    });
  }
};
