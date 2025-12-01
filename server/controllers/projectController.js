import prisma from '../prisma.config.js';

// Get all projects
export const getAllProjects = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userRole = req.user.role;

    let projects;

    if (userRole === 'ADMIN' || userRole === 'SUPERADMIN') {
      // Admins see all projects
      projects = await prisma.project.findMany({
        include: {
          _count: {
            select: {
              tasks: true,
              users: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } else {
      // Regular users see only their assigned projects
      const userProjects = await prisma.userProject.findMany({
        where: {
          userId: parseInt(userId),
        },
        include: {
          project: {
            include: {
              _count: {
                select: {
                  tasks: true,
                  users: true,
                },
              },
            },
          },
        },
      });

      projects = userProjects.map((up) => up.project);
    }

    return res.status(200).json({
      success: true,
      data: projects,
    });
  } catch (error) {
    console.error('Get projects error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching projects',
      error: error.message,
    });
  }
};

// Get a single project by ID
export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const userRole = req.user.role;

    const project = await prisma.project.findUnique({
      where: { id: parseInt(id) },
      include: {
        tasks: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        users: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
              },
            },
          },
        },
      },
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Check if user has access to this project
    if (userRole !== 'ADMIN' && userRole !== 'SUPERADMIN') {
      const userProject = await prisma.userProject.findFirst({
        where: {
          userId: parseInt(userId),
          projectId: parseInt(id),
        },
      });

      if (!userProject) {
        return res.status(403).json({
          success: false,
          message: 'You do not have access to this project',
        });
      }
    }

    return res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error('Get project error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching project',
      error: error.message,
    });
  }
};

// Create a new project (Admin/SuperAdmin only)
export const createProject = async (req, res) => {
  try {
    const { name, description, status } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Project name is required',
      });
    }

    const existingProject = await prisma.project.findUnique({
      where: { name },
    });

    if (existingProject) {
      return res.status(409).json({
        success: false,
        message: 'Project with this name already exists',
      });
    }

    const project = await prisma.project.create({
      data: {
        name,
        description: description || null,
        status: status || 'active',
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project,
    });
  } catch (error) {
    console.error('Create project error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error creating project',
      error: error.message,
    });
  }
};

// Update a project (Admin/SuperAdmin only)
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, status } = req.body;

    const project = await prisma.project.findUnique({
      where: { id: parseInt(id) },
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    const updatedProject = await prisma.project.update({
      where: { id: parseInt(id) },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(status && { status }),
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: updatedProject,
    });
  } catch (error) {
    console.error('Update project error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error updating project',
      error: error.message,
    });
  }
};

// Delete a project (Admin/SuperAdmin only)
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await prisma.project.findUnique({
      where: { id: parseInt(id) },
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    await prisma.project.delete({
      where: { id: parseInt(id) },
    });

    return res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    console.error('Delete project error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error deleting project',
      error: error.message,
    });
  }
};
