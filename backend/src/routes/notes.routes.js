const express = require('express');
const router = express.Router();
const notesController = require('../controllers/notes.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// All notes routes require authentication
router.use(verifyToken);

router.post('/', notesController.createNote);
router.get('/', notesController.getNotes);
router.get('/:id', notesController.getNoteById);
router.put('/:id', notesController.updateNote);
router.delete('/:id', notesController.deleteNote);

module.exports = router;
