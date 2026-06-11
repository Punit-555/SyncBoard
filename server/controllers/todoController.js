import prisma from '../prisma.config.js';

const ALLOWED_COLORS = ['default', 'blue', 'green', 'amber', 'rose', 'purple'];

// Get all todos for the authenticated user (owner-only, regardless of role)
export const getTodos = async (req, res) => {
  try {
    const userId = req.user.userId;

    const todos = await prisma.todoNote.findMany({
      where: { userId },
      orderBy: [{ pinned: 'desc' }, { createdAt: 'desc' }],
    });

    return res.status(200).json({
      success: true,
      data: todos,
    });
  } catch (error) {
    console.error('Get todos error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching todos',
      error: error.message,
    });
  }
};

// Create a todo
export const createTodo = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { title, content, color, pinned } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Title is required',
      });
    }

    const todo = await prisma.todoNote.create({
      data: {
        title: title.trim(),
        content: content?.trim() || null,
        color: ALLOWED_COLORS.includes(color) ? color : 'default',
        pinned: !!pinned,
        userId,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Todo created',
      data: todo,
    });
  } catch (error) {
    console.error('Create todo error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error creating todo',
      error: error.message,
    });
  }
};

// Update a todo (owner only)
export const updateTodo = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const { title, content, completed, pinned, color } = req.body;

    const todo = await prisma.todoNote.findUnique({ where: { id } });

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found',
      });
    }

    // Strict ownership — even admins cannot touch another user's todos
    if (todo.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only modify your own todos',
      });
    }

    const updated = await prisma.todoNote.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(content !== undefined && { content: content?.trim() || null }),
        ...(completed !== undefined && { completed: !!completed }),
        ...(pinned !== undefined && { pinned: !!pinned }),
        ...(color !== undefined && {
          color: ALLOWED_COLORS.includes(color) ? color : 'default',
        }),
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Todo updated',
      data: updated,
    });
  } catch (error) {
    console.error('Update todo error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error updating todo',
      error: error.message,
    });
  }
};

// Delete a todo (owner only)
export const deleteTodo = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const todo = await prisma.todoNote.findUnique({ where: { id } });

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found',
      });
    }

    if (todo.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own todos',
      });
    }

    await prisma.todoNote.delete({ where: { id } });

    return res.status(200).json({
      success: true,
      message: 'Todo deleted',
    });
  } catch (error) {
    console.error('Delete todo error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error deleting todo',
      error: error.message,
    });
  }
};
