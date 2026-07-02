const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { interrogationChat } = require('../services/geminiService');

// POST /api/chat
router.post('/', protect, async (req, res, next) => {
  try {
    const { question, metadata } = req.body;
    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      return res.status(400).json({ error: 'Please provide a question.' });
    }
    const result = await interrogationChat(question.trim(), metadata || {});
    res.json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
