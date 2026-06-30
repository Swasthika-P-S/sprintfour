const express = require('express');
const { analyzeText, translateText, simulatePrivacy } = require('../controllers/analyzeController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// POST /api/analyze
router.post('/', protect, analyzeText);

// POST /api/analyze/translate
router.post('/translate', protect, translateText);

// POST /api/analyze/simulate
router.post('/simulate', protect, simulatePrivacy);

module.exports = router;
