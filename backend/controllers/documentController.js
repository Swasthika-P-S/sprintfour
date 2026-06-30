const Document = require('../models/Document');

/**
 * POST /api/save
 * Body: { originalText, redactedText, detectedPII, stats }
 */
async function saveDocument(req, res, next) {
  try {
    const { originalText, redactedText, detectedPII, stats } = req.body;

    if (!originalText) {
      return res.status(400).json({ error: 'originalText is required.' });
    }

    const doc = new Document({
      user: req.user._id,
      originalText,
      redactedText: redactedText || '',
      detectedPII: detectedPII || [],
      stats: stats || { total: 0, accepted: 0, rejected: 0 },
    });

    const saved = await doc.save();
    return res.status(201).json({ message: 'Document saved!', document: saved });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/history
 * Returns all saved documents (newest first), limited to 50
 */
async function getHistory(req, res, next) {
  try {
    const docs = await Document.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50)
      .select('originalText redactedText stats detectedPII createdAt');

    return res.json({ documents: docs });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/history/:id
 * Returns a single document by ID
 */
async function getDocumentById(req, res, next) {
  try {
    const doc = await Document.findOne({ _id: req.params.id, user: req.user._id });
    if (!doc) {
      return res.status(404).json({ error: 'Document not found.' });
    }
    return res.json({ document: doc });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/history/:id
 */
async function deleteDocument(req, res, next) {
  try {
    const doc = await Document.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!doc) {
      return res.status(404).json({ error: 'Document not found.' });
    }
    return res.json({ message: 'Document deleted.' });
  } catch (err) {
    next(err);
  }
}

module.exports = { saveDocument, getHistory, getDocumentById, deleteDocument };
