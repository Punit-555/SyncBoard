import prisma from '../prisma.config.js';
import { sendEmail } from '../services/emailService.js';

// Get all projects
export const getAllProjects = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userRole = req.user.role;

    let projects;

    if (userRole === 'ADMIN' || userRole === 'SUPERADMIN') {
      // Admins see all projects with members
      projects = await prisma.project.findMany({
        include: {
          _count: {
            select: {
              tasks: true,
              users: true,
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
        orderBy: {
          createdAt: 'desc',
        },
      });
    } else {
      // Regular users see only their assigned projects
      const userProjects = await prisma.userProject.findMany({
        where: {
          userId: userId,
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
          userId: userId,
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

// Add user to project (Admin/SuperAdmin only)
export const addUserToProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { userId } = req.body;
    const addedById = req.user.userId;

    console.log('📝 Adding user to project:', { projectId, userId, addedById });

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
    }

    // Get project details
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      console.log('❌ Project not found:', projectId);
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    console.log('✅ Project found:', project.name);

    // Get user details
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      },
    });

    if (!user) {
      console.log('❌ User not found:', userId);
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    console.log('✅ User found:', user.email);

    // Check if user is already in project
    const existingUserProject = await prisma.userProject.findFirst({
      where: {
        userId: userId,
        projectId: projectId,
      },
    });

    if (existingUserProject) {
      console.log('⚠️ User already in project:', { userId, projectId, existingId: existingUserProject.id });
      return res.status(409).json({
        success: false,
        message: `${user.firstName} ${user.lastName} is already a member of this project`,
      });
    }

    // Add user to project
    await prisma.userProject.create({
      data: {
        userId: userId,
        projectId: projectId,
      },
    });

    // Send response immediately, then send email in background
    const responsePromise = res.status(200).json({
      success: true,
      message: 'User added to project successfully',
    });

    // Get admin details and send email asynchronously (don't block response)
    (async () => {
      try {
        const admin = await prisma.user.findUnique({
          where: { id: addedById },
          select: {
            firstName: true,
            lastName: true,
          },
        });

        const adminName = admin ? `${admin.firstName} ${admin.lastName}` : 'Admin';

        await sendEmail(
          user.email,
          `Added to Project: ${project.name}`,
          generateProjectAssignmentHTML(
            `${user.firstName} ${user.lastName}`,
            adminName,
            project.name,
            project.description
          )
        );
        console.log(`✅ Project assignment email sent to ${user.email}`);
      } catch (emailError) {
        console.error('❌ Failed to send project assignment email:', emailError);
      }
    })();

    return responsePromise;
  } catch (error) {
    console.error('Add user to project error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error adding user to project',
      error: error.message,
    });
  }
};

// Remove user from project (Admin/SuperAdmin only)
export const removeUserFromProject = async (req, res) => {
  try {
    const { projectId, userId } = req.params;
    const removedById = req.user.userId;

    // Get project details
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Get user details
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if user is in project
    const userProject = await prisma.userProject.findFirst({
      where: {
        userId: userId,
        projectId: projectId,
      },
    });

    if (!userProject) {
      return res.status(404).json({
        success: false,
        message: 'User is not a member of this project',
      });
    }

    // Remove user from project
    await prisma.userProject.delete({
      where: {
        id: userProject.id,
      },
    });

    // Get admin details for email
    const admin = await prisma.user.findUnique({
      where: { id: removedById },
      select: {
        firstName: true,
        lastName: true,
      },
    });

    const adminName = admin ? `${admin.firstName} ${admin.lastName}` : 'Admin';

    // Send email notification asynchronously (don't block response)
    sendEmail(
      user.email,
      `Removed from Project: ${project.name}`,
      generateProjectRemovalHTML(
        `${user.firstName} ${user.lastName}`,
        adminName,
        project.name
      )
    )
      .then(() => console.log(`✅ Project removal email sent to ${user.email}`))
      .catch((emailError) => console.error('❌ Failed to send project removal email:', emailError));

    return res.status(200).json({
      success: true,
      message: 'User removed from project successfully',
    });
  } catch (error) {
    console.error('Remove user from project error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error removing user from project',
      error: error.message,
    });
  }
};

// HTML template for project assignment email
function generateProjectAssignmentHTML(userName, adminName, projectName, projectDescription) {
  const currentYear = new Date().getFullYear();

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 30px 20px;
          text-align: center;
          color: white;
        }
        .header h1 { font-size: 32px; margin-bottom: 10px; font-weight: 700; color: white; }
        .content { padding: 30px; }
        .greeting { font-size: 18px; color: #333; margin-bottom: 20px; font-weight: 600; }
        .message { color: #555; font-size: 15px; line-height: 1.8; margin-bottom: 25px; }
        .project-box {
          background: linear-gradient(135deg, #e0f2fe 0%, #ddd6fe 100%);
          border: 2px solid #667eea;
          border-radius: 8px;
          padding: 25px;
          margin: 25px 0;
        }
        .project-name {
          font-size: 20px;
          color: #333;
          font-weight: 700;
          margin-bottom: 15px;
        }
        .project-description {
          color: #555;
          font-size: 14px;
          line-height: 1.6;
          margin-top: 10px;
        }
        .cta-button { text-align: center; margin: 30px 0; }
        .cta-button a {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 14px 40px;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 600;
          font-size: 16px;
        }
        .footer {
          background: #f8f9fa;
          padding: 30px;
          text-align: center;
          font-size: 12px;
          color: #999;
          border-top: 1px solid #eee;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Assigned to New Project</h1>
          <p>You've been added to a project</p>
        </div>
        <div class="content">
          <p class="greeting">Hi ${userName}!</p>
          <p class="message">
            Great news! <strong>${adminName}</strong> has assigned you to a new project in SyncBoard:
          </p>

          <div class="project-box">
            <div class="project-name">
              📁 ${projectName}
            </div>
            ${projectDescription ? `<div class="project-description">${projectDescription}</div>` : ''}
          </div>

          <p class="message">
            You can now view and manage tasks associated with this project. Login to SyncBoard to get started!
          </p>

          <div class="cta-button">
            <a href="http://localhost:5173/projects">View Project →</a>
          </div>
        </div>

        <div class="footer">
          <p style="margin-bottom: 10px;">
            © ${currentYear} SyncBoard. All rights reserved.<br>
            <a href="http://localhost:5173" style="color: #667eea; text-decoration: none;">Visit SyncBoard</a> |
            <a href="http://localhost:5173/help" style="color: #667eea; text-decoration: none;">Help Center</a>
          </p>
          <p style="margin-top: 15px; font-size: 11px;">
            You're receiving this email because you were added to a project in SyncBoard.
          </p>
          <p style="margin-top: 10px; font-size: 10px; color: #bbb;">
            Developed by <strong>Punit</strong>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// HTML template for project removal email
function generateProjectRemovalHTML(userName, adminName, projectName) {
  const currentYear = new Date().getFullYear();

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        .header {
          background: linear-gradient(135deg, #f72585 0%, #d11d6e 100%);
          padding: 30px 20px;
          text-align: center;
          color: white;
        }
        .header h1 { font-size: 32px; margin-bottom: 10px; font-weight: 700; color: white; }
        .content { padding: 30px; }
        .greeting { font-size: 18px; color: #333; margin-bottom: 20px; font-weight: 600; }
        .message { color: #555; font-size: 15px; line-height: 1.8; margin-bottom: 25px; }
        .project-box {
          background: #fff3cd;
          border: 2px solid #ffc107;
          border-radius: 8px;
          padding: 25px;
          margin: 25px 0;
        }
        .project-name {
          font-size: 20px;
          color: #333;
          font-weight: 700;
          margin-bottom: 15px;
        }
        .cta-button { text-align: center; margin: 30px 0; }
        .cta-button a {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 14px 40px;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 600;
          font-size: 16px;
        }
        .footer {
          background: #f8f9fa;
          padding: 30px;
          text-align: center;
          font-size: 12px;
          color: #999;
          border-top: 1px solid #eee;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚫 Removed from Project</h1>
          <p>You have been removed from a project</p>
        </div>
        <div class="content">
          <p class="greeting">Hi ${userName}!</p>
          <p class="message">
            <strong>${adminName}</strong> has removed you from the following project in SyncBoard:
          </p>

          <div class="project-box">
            <div class="project-name">
              📁 ${projectName}
            </div>
            <p style="color: #856404; font-size: 14px;">
              You no longer have access to this project and its tasks.
            </p>
          </div>

          <p class="message">
            If you believe this was done in error, please contact your administrator.
          </p>

          <div class="cta-button">
            <a href="http://localhost:5173/projects">View Your Projects →</a>
          </div>
        </div>

        <div class="footer">
          <p style="margin-bottom: 10px;">
            © ${currentYear} SyncBoard. All rights reserved.<br>
            <a href="http://localhost:5173" style="color: #667eea; text-decoration: none;">Visit SyncBoard</a> |
            <a href="http://localhost:5173/help" style="color: #667eea; text-decoration: none;">Help Center</a>
          </p>
          <p style="margin-top: 15px; font-size: 11px;">
            You're receiving this email because you were removed from a project in SyncBoard.
          </p>
          <p style="margin-top: 10px; font-size: 10px; color: #bbb;">
            Developed by <strong>Punit</strong>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}
