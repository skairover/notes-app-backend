// server/routes/expenses.js
const express = require('express');
const Note = require('../models/Note');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Protected routes
router.use(authMiddleware);

// Get all expenses
router.get('/', async (req, res) => {
  const notes = await Note.find({ userId: req.userId });
  res.json(notes);
});

// Add expense
router.post('/', async (req, res) => {
  const { title, content } = req.body;
  const note = new Note({ title, content, userId: req.userId });
  await note.save();
  res.status(201).json(note);
});


router.delete('/:id', async (req, res) => {

  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!note) {
      console.log('Note not found or user mismatch');
      return res.status(404).json({ error: 'Note not found' });
    }

    console.log('Note deleted:', note);
    res.json({ message: 'Note deleted' });
  } catch (err) {
    console.error('Server crash in DELETE /api/notes/:id:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router;
