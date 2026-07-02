const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { verifyIntegrity } = require('../services/integrityService');
const { redTeamCheck } = require('../services/geminiService');

// POST /api/verify — run integrity check
router.post('/', protect, async (req, res, next) => {
  try {
    const { originalText, redactedText, entities, redactedIndices } = req.body;
    if (!redactedText) return res.status(400).json({ error: 'redactedText is required.' });
    
    // Tag entities with their redaction status for the check
    const taggedEntities = (entities || []).map((e, i) => ({
      ...e,
      _shouldBeRedacted: (redactedIndices || []).includes(i)
    }));
    
    const report = verifyIntegrity(originalText || '', redactedText, taggedEntities);
    res.json(report);
  } catch (err) {
    next(err);
  }
});

// POST /api/verify/redteam — adversarial re-identification check
router.post('/redteam', protect, async (req, res, next) => {
  try {
    const { redactedText, entities } = req.body;
    if (!redactedText) return res.status(400).json({ error: 'redactedText is required.' });
    const result = await redTeamCheck(redactedText, entities || []);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
