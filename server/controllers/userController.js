import bcrypt from 'bcrypt';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import prisma from '../prisma.config.js';
import { sendWelcomeEmailWithPassword, sendAccountDetailsEmail, sendUserUpdateEmail, sendUserDeletedEmail } from '../services/emailService.js';

// Generate a secure random password
const generateRandomPassword = (length = 12) => {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*';
  const allChars = uppercase + lowercase + numbers + symbols;

  let password = '';
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];

  for (let i = 4; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  return password.split('').sort(() => Math.random() - 0.5).join('');
};

// Get all users (accessible to all authenticated users)
export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        profilePicture: true,
        role: true,
        managerId: true,
        createdAt: true,
        updatedAt: true,
        manager: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        projects: {
          include: {
            project: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error('Get all users error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching users',
      error: error.message,
    });
  }
};

// Get a single user by ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        managerId: true,
        createdAt: true,
        updatedAt: true,
        manager: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        projects: {
          include: {
            project: {
              select: {
                id: true,
                name: true,
                description: true,
              },
            },
          },
        },
        tasks: {
          select: {
            id: true,
            title: true,
            status: true,
            priority: true,
            projectId: true,
          },
        },
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

// Create a new user (Admin/SuperAdmin only)
export const createUser = async (req, res) => {
  try {
    const { email, firstName, lastName, role, managerId, projectIds } = req.body;
    const requestUserRole = req.user.role;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    // Only SuperAdmin can create Admin or SuperAdmin users
    if ((role === 'ADMIN' || role === 'SUPERADMIN') && requestUserRole !== 'SUPERADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Only SuperAdmin can create Admin or SuperAdmin users',
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    // Generate a random password
    const randomPassword = generateRandomPassword();
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName: firstName || '',
        lastName: lastName || '',
        role: role || 'USER',
        managerId: managerId ? managerId : null,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        managerId: true,
        createdAt: true,
      },
    });

    // Assign user to projects if projectIds are provided
    if (projectIds && Array.isArray(projectIds) && projectIds.length > 0) {
      const userProjects = projectIds.map((projectId) => ({
        userId: user.id,
        projectId: projectId,
      }));

      await prisma.userProject.createMany({
        data: userProjects,
      });
    }

    // Send welcome email with password to the new user
    try {
      await sendWelcomeEmailWithPassword(email, firstName || 'User', randomPassword);
      console.log(`✅ Welcome email with credentials sent to ${email}`);
      
      // Also send account details email with role and project info
      const projectNames = projectIds && projectIds.length > 0 
        ? (await prisma.project.findMany({
            where: { id: { in: projectIds.map(id => id) } },
            select: { name: true },
          })).map(p => p.name)
        : [];
      
      await sendAccountDetailsEmail(email, firstName || 'User', role || 'USER', projectNames);
      console.log(`✅ Account details email sent to ${email}`);
    } catch (emailError) {
      console.error('Error sending user emails:', emailError);
      // Don't fail the request if email fails
    }

    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: user,
    });
  } catch (error) {
    console.error('Create user error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error creating user',
      error: error.message,
    });
  }
};

// Update a user (Admin/SuperAdmin only)
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, firstName, lastName, role, managerId, projectIds } = req.body;
    const requestUserRole = req.user.role;
    const requestUserId = req.user.userId;

    // Find the user
    const user = await prisma.user.findUnique({
      where: { id: id },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Only SuperAdmin can update Admin or SuperAdmin users
    if ((user.role === 'ADMIN' || user.role === 'SUPERADMIN') && requestUserRole !== 'SUPERADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Only SuperAdmin can update Admin or SuperAdmin users',
      });
    }

    // Only SuperAdmin can set role to Admin or SuperAdmin
    if (role && (role === 'ADMIN' || role === 'SUPERADMIN') && requestUserRole !== 'SUPERADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Only SuperAdmin can assign Admin or SuperAdmin roles',
      });
    }

    // Prevent users from updating themselves to a higher role
    if (id === requestUserId && role && role !== user.role) {
      return res.status(403).json({
        success: false,
        message: 'You cannot change your own role',
      });
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: id },
      data: {
        ...(email && { email }),
        ...(firstName !== undefined && { firstName }),
        ...(lastName !== undefined && { lastName }),
        ...(role && { role }),
        ...(managerId !== undefined && { managerId: managerId ? managerId : null }),
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        managerId: true,
        updatedAt: true,
      },
    });

    // Update project assignments if provided
    if (projectIds !== undefined && Array.isArray(projectIds)) {
      // Delete existing project assignments
      await prisma.userProject.deleteMany({
        where: { userId: id },
      });

      // Create new project assignments
      if (projectIds.length > 0) {
        const userProjects = projectIds.map((projectId) => ({
          userId: id,
          projectId: projectId,
        }));

        await prisma.userProject.createMany({
          data: userProjects,
        });
      }
    }

    // Send update notification email with changed fields
    try {
      const updatedFields = {};
      if (role) updatedFields['Role'] = role;
      if (firstName) updatedFields['First Name'] = firstName;
      if (lastName) updatedFields['Last Name'] = lastName;
      if (projectIds !== undefined) {
        const projects = await prisma.project.findMany({
          where: { id: { in: projectIds.map(id => id) } },
          select: { name: true },
        });
        updatedFields['Assigned Projects'] = projects.length > 0 ? projects.map(p => p.name).join(', ') : 'None';
      }

      if (Object.keys(updatedFields).length > 0) {
        await sendUserUpdateEmail(user.email, user.firstName || 'User', updatedFields);
        console.log(`✅ Update notification email sent to ${user.email}`);
      }
    } catch (emailError) {
      console.error('Error sending update email:', emailError);
      // Don't fail the request if email fails
    }

    return res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    console.error('Update user error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error updating user',
      error: error.message,
    });
  }
};

// Delete a user (Admin/SuperAdmin only)
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const requestUserRole = req.user.role;
    const requestUserId = req.user.userId;

    // Prevent users from deleting themselves
    if (id === requestUserId) {
      return res.status(403).json({
        success: false,
        message: 'You cannot delete your own account via this endpoint',
      });
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { id: id },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Only SuperAdmin can delete Admin or SuperAdmin users
    if ((user.role === 'ADMIN' || user.role === 'SUPERADMIN') && requestUserRole !== 'SUPERADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Only SuperAdmin can delete Admin or SuperAdmin users',
      });
    }

    // Send deletion notification email before deleting
    try {
      await sendUserDeletedEmail(user.email, user.firstName || 'User');
      console.log(`✅ Deletion notification email sent to ${user.email}`);
    } catch (emailError) {
      console.error('Error sending deletion email:', emailError);
      // Don't fail the deletion if email fails
    }

    await prisma.user.delete({
      where: { id: id },
    });

    return res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Delete user error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error deleting user',
      error: error.message,
    });
  }
};

// Upload profile picture
export const uploadProfilePicture = async (req, res) => {
  try {
    const userId = req.user.userId;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    // Get the user's current profile picture
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { profilePicture: true },
    });

    // Delete old profile picture if exists
    if (user?.profilePicture) {
      const oldFilePath = path.join(process.cwd(), user.profilePicture);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    // Save the new profile picture path
    const profilePicturePath = `/uploads/profile-pictures/${req.file.filename}`;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { profilePicture: profilePicturePath },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        profilePicture: true,
        role: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Profile picture uploaded successfully',
      data: updatedUser,
    });
  } catch (error) {
    console.error('Upload profile picture error:', error);

    // Delete the uploaded file if there was an error
    if (req.file) {
      const filePath = path.join(process.cwd(), 'uploads', 'profile-pictures', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    return res.status(500).json({
      success: false,
      message: 'Server error uploading profile picture',
      error: error.message,
    });
  }
};

// Delete profile picture
export const deleteProfilePicture = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { profilePicture: true },
    });

    if (!user?.profilePicture) {
      return res.status(404).json({
        success: false,
        message: 'No profile picture to delete',
      });
    }

    // Delete the file
    const filePath = path.join(process.cwd(), user.profilePicture);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Update database
    await prisma.user.update({
      where: { id: userId },
      data: { profilePicture: null },
    });

    return res.status(200).json({
      success: true,
      message: 'Profile picture deleted successfully',
    });
  } catch (error) {
    console.error('Delete profile picture error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error deleting profile picture',
      error: error.message,
    });
  }
};
