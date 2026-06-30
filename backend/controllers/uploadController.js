const { extractTextFromFile } = require('../services/fileProcessor');
const { detectWithRegex } = require('../services/piiDetector');

/**
 * POST /api/upload
 * Accepts multipart/form-data with a 'file' field.
 * Returns: { text, entities, method }
 */
async function uploadFile(req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

    const { path: filePath, mimetype, originalname } = req.file;
    const result = await extractTextFromFile(filePath, mimetype);

    if (!result.text) {
      return res.status(422).json({
        error: result.error || 'Could not extract text from the file.',
        method: result.method,
      });
    }

    // Run regex PII detection on extracted text
    const entities = detectWithRegex(result.text);

    res.json({
      text: result.text,
      entities,
      method: result.method,
      filename: originalname,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { uploadFile };
