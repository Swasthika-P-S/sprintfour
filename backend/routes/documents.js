const express = require('express');
const {
  saveDocument,
  getHistory,
  getDocumentById,
  deleteDocument,
} = require('../controllers/documentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All document routes require auth
router.post('/save',       protect, saveDocument);
router.get('/history',     protect, getHistory);
router.get('/history/:id', protect, getDocumentById);
router.delete('/:id',      protect, deleteDocument);

module.exports = router;
