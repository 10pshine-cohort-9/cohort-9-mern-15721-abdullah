const prisma = require('../db');

exports.createNote = async (req, res, next) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const note = await prisma.note.create({
      data: {
        title,
        content,
        userId: req.user.userId
      }
    });

    res.status(201).json({
      message: 'Note created successfully',
      note
    });
  } catch (error) {
    next(error);
  }
};

exports.getNotes = async (req, res, next) => {
  try {
    const notes = await prisma.note.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({ notes });
  } catch (error) {
    next(error);
  }
};

exports.getNoteById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const note = await prisma.note.findUnique({
      where: { id }
    });

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    if (note.userId !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized access to note' });
    }

    res.status(200).json({ note });
  } catch (error) {
    next(error);
  }
};

exports.updateNote = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const existingNote = await prisma.note.findUnique({
      where: { id }
    });

    if (!existingNote) {
      return res.status(404).json({ error: 'Note not found' });
    }

    if (existingNote.userId !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized access to note' });
    }

    const note = await prisma.note.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(content && { content })
      }
    });

    res.status(200).json({
      message: 'Note updated successfully',
      note
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteNote = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existingNote = await prisma.note.findUnique({
      where: { id }
    });

    if (!existingNote) {
      return res.status(404).json({ error: 'Note not found' });
    }

    if (existingNote.userId !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized access to note' });
    }

    await prisma.note.delete({
      where: { id }
    });

    res.status(200).json({
      message: 'Note deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
