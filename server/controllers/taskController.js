import prisma from '../prisma.config.js';
import { sendTaskAssignmentEmail } from '../services/emailService.js';

// Get all tasks for the authenticated user
export const getTasks = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userRole = req.user.role;

    let tasks;

    if (userRole === 'SUPERADMIN' || userRole === 'ADMIN') {
      // Admin and SuperAdmin can see all tasks
      tasks = await prisma.task.findMany({
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          manager: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          project: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } else {
      // Regular users see only their tasks
      tasks = await prisma.task.findMany({
        where: {
          userId: parseInt(userId),
        },
        include: {
          manager: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          project: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    }

    return res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching tasks',
      error: error.message,
    });
  }
};

// Create a new task
export const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, userId, managerId, projectId, dueDate } = req.body;
    const requestUserId = req.user.userId;
    const userRole = req.user.role;

    if (!title || !projectId) {
      return res.status(400).json({
        success: false,
        message: 'Title and project ID are required',
      });
    }

    let targetUserId = userId || requestUserId;

    console.log('🔐 Task Creation Permission Check:', {
      requestUserId,
      userRole,
      targetUserId: userId,
      isAssigningToOther: userId && parseInt(userId) !== parseInt(requestUserId),
      isAdmin: userRole === 'ADMIN' || userRole === 'SUPERADMIN'
    });

    // Only regular users need permission check
    // Admins and SuperAdmins can create tasks for anyone
    if (userId && parseInt(userId) !== parseInt(requestUserId)) {
      if (userRole !== 'ADMIN' && userRole !== 'SUPERADMIN') {
        console.log('❌ Permission denied: User is not Admin/SuperAdmin');
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to create tasks for other users',
        });
      } else {
        console.log('✅ Permission granted: User is Admin/SuperAdmin');
      }
    } else {
      console.log('✅ Creating task for self');
    }

    const project = await prisma.project.findUnique({
      where: { id: parseInt(projectId) },
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description: description || null,
        status: status || 'pending',
        priority: priority || 'medium',
        userId: parseInt(targetUserId),
        managerId: managerId ? parseInt(managerId) : null,
        projectId: parseInt(projectId),
        dueDate: dueDate ? new Date(dueDate) : null,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        manager: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Send email notification to the assigned user
    // Only send email if assigning to someone else (not yourself)
    if (task.user && task.user.email && parseInt(task.userId) !== parseInt(requestUserId)) {
      try {
        console.log(`📧 Attempting to send email to ${task.user.email}...`);

        const assignedByUser = await prisma.user.findUnique({
          where: { id: parseInt(requestUserId) },
          select: {
            firstName: true,
            lastName: true,
          },
        });

        const assignedByName = assignedByUser
          ? `${assignedByUser.firstName} ${assignedByUser.lastName}`
          : 'Admin';

        const assigneeName = `${task.user.firstName} ${task.user.lastName}`;

        const taskDetails = {
          title: task.title,
          description: task.description,
          priority: task.priority,
          status: task.status,
          dueDate: task.dueDate,
          projectName: task.project.name,
        };

        console.log(`📨 Sending email with details:`, {
          to: task.user.email,
          assigneeName,
          assignedByName,
          taskTitle: taskDetails.title
        });

        await sendTaskAssignmentEmail(
          task.user.email,
          assigneeName,
          assignedByName,
          taskDetails
        );

        console.log(`✅ Task assignment email sent successfully to ${task.user.email}`);
      } catch (emailError) {
        console.error('❌ Failed to send task assignment email:', emailError);
        console.error('❌ Error details:', {
          message: emailError.message,
          stack: emailError.stack
        });
        // Don't fail the task creation if email fails
      }
    } else {
      console.log(`ℹ️ Email not sent. Reasons:`, {
        hasUser: !!task.user,
        hasEmail: !!task.user?.email,
        isSelfAssignment: parseInt(task.userId) === parseInt(requestUserId),
        taskUserId: task.userId,
        requestUserId: requestUserId
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task,
    });
  } catch (error) {
    console.error('Create task error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error creating task',
      error: error.message,
    });
  }
};

// Update a task
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority, managerId, projectId, dueDate, userId: newUserId } = req.body;
    const userId = req.user.userId;
    const userRole = req.user.role;

    // Find the task
    const task = await prisma.task.findUnique({
      where: { id: parseInt(id) },
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    if (task.userId !== parseInt(userId) && userRole !== 'ADMIN' && userRole !== 'SUPERADMIN') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this task',
      });
    }

    // Check if the assigned user is changing
    const isUserChanging = newUserId !== undefined && parseInt(newUserId) !== task.userId;

    const updatedTask = await prisma.task.update({
      where: { id: parseInt(id) },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(status && { status }),
        ...(priority && { priority }),
        ...(managerId !== undefined && { managerId: managerId ? parseInt(managerId) : null }),
        ...(projectId && { projectId: parseInt(projectId) }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
        ...(newUserId !== undefined && { userId: newUserId ? parseInt(newUserId) : task.userId }),
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        manager: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Send email notification if user assignment changed
    if (isUserChanging && updatedTask.user && updatedTask.user.email) {
      try {
        const assignedByUser = await prisma.user.findUnique({
          where: { id: parseInt(userId) },
          select: {
            firstName: true,
            lastName: true,
          },
        });

        const assignedByName = assignedByUser
          ? `${assignedByUser.firstName} ${assignedByUser.lastName}`
          : 'Admin';

        const assigneeName = `${updatedTask.user.firstName} ${updatedTask.user.lastName}`;

        const taskDetails = {
          title: updatedTask.title,
          description: updatedTask.description,
          priority: updatedTask.priority,
          status: updatedTask.status,
          dueDate: updatedTask.dueDate,
          projectName: updatedTask.project.name,
        };

        await sendTaskAssignmentEmail(
          updatedTask.user.email,
          assigneeName,
          assignedByName,
          taskDetails
        );

        console.log(`✅ Task reassignment email sent to ${updatedTask.user.email}`);
      } catch (emailError) {
        console.error('❌ Failed to send task reassignment email:', emailError.message);
        // Don't fail the task update if email fails
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: updatedTask,
    });
  } catch (error) {
    console.error('Update task error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error updating task',
      error: error.message,
    });
  }
};

// Delete a task
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const userRole = req.user.role;

    // Find the task
    const task = await prisma.task.findUnique({
      where: { id: parseInt(id) },
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Check permissions: user can delete their own tasks, admins can delete any task
    if (task.userId !== parseInt(userId) && userRole !== 'ADMIN' && userRole !== 'SUPERADMIN') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this task',
      });
    }

    await prisma.task.delete({
      where: { id: parseInt(id) },
    });

    return res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    console.error('Delete task error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error deleting task',
      error: error.message,
    });
  }
};

// Get a single task by ID
export const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const userRole = req.user.role;

    const task = await prisma.task.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        manager: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Check permissions: user can view their own tasks, admins can view any task
    if (task.userId !== parseInt(userId) && userRole !== 'ADMIN' && userRole !== 'SUPERADMIN') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view this task',
      });
    }

    return res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    console.error('Get task error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching task',
      error: error.message,
    });
  }
};
