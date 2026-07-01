const { detectWithRegex } = require('../services/piiDetector');
const { detectWithGemini, translateSafeText, simulatePrivacyRisk } = require('../services/geminiService');

/**
 * POST /api/analyze
 * Body: { text: string }
 * Returns: { entities: PII[] }
 */
async function analyzeText(req, res, next) {
  try {
    const { text } = req.body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ error: 'Please provide a non-empty text field.' });
    }

    if (text.length > 50000) {
      return res.status(400).json({ error: 'Text is too long. Maximum 50,000 characters.' });
    }

    // Step 1: Run fast regex detection
    const regexEntities = detectWithRegex(text);

    // Step 2: Run Gemini for names/addresses (in parallel, non-blocking)
    const { sensitive_entities, safe_entities } = await detectWithGemini(text);

    // Step 3: Merge — avoid duplicates (same startIndex)
    const regexPositions = new Set(regexEntities.map((e) => e.startIndex));
    const filteredGemini = sensitive_entities.filter(
      (e) =>
        !regexPositions.has(e.startIndex) &&
        !regexEntities.some(
          (r) => r.text.includes(e.text) || e.text.includes(r.text)
        )
    );

    const allEntities = [...regexEntities, ...filteredGemini].sort(
      (a, b) => a.startIndex - b.startIndex
    );

    return res.json({
      entities: allEntities,
      safeEntities: safe_entities || [],
      total: allEntities.length,
      detectionMethods: {
        regex: regexEntities.length,
        ai: filteredGemini.length,
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/analyze/translate
 * Body: { text: string, targetLanguage: string }
 * Returns: { translatedText: string }
 */
async function translateText(req, res, next) {
  try {
    const { text, targetLanguage } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Please provide text to translate.' });
    }
    
    const translatedText = await translateSafeText(text, targetLanguage || 'English');
    return res.json({ translatedText });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/analyze/simulate
 * Body: { text: string, context: string }
 * Returns: { simulation: { riskLevel, confidence, reason, suggestions } }
 */
async function simulatePrivacy(req, res, next) {
  try {
    const { text, context } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Please provide redacted text to simulate.' });
    }
    
    const simulation = await simulatePrivacyRisk(text, context);
    return res.json({ simulation });
  } catch (err) {
    next(err);
  }
}

module.exports = { analyzeText, translateText, simulatePrivacy };
