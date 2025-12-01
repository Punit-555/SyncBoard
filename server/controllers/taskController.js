import prisma from '../prisma.config.js';

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

    // Determine the target user ID
    let targetUserId = userId || requestUserId;

    // Only admins and superadmins can create tasks for other users
    if (userId && userId !== requestUserId && userRole !== 'ADMIN' && userRole !== 'SUPERADMIN') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to create tasks for other users',
      });
    }

    // Verify project exists
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
    const { title, description, status, priority, managerId, projectId, dueDate } = req.body;
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

    // Check permissions: user can update their own tasks, admins can update any task
    if (task.userId !== parseInt(userId) && userRole !== 'ADMIN' && userRole !== 'SUPERADMIN') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this task',
      });
    }

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
