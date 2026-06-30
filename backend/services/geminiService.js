const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = process.env.GEMINI_API_KEY;

/**
 * Use Gemini to detect Names and Addresses that regex can't catch.
 * Returns an array of entity objects.
 */
async function detectWithGemini(text) {
  if (!apiKey) {
    console.warn('⚠️  GEMINI_API_KEY not set. Skipping AI detection.');
    return [];
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `You are a PII (Personally Identifiable Information) detection expert.
Analyze the following text (which may be in English, Tamil, or Hindi) and identify ONLY:
1. Full person names (NAME)
2. Physical addresses (ADDRESS)
3. Organization names that could identify someone (ORG)
4. Indirect Identifiers like Roll Numbers, College Names, Specific Locations, or highly unique Job Titles (INDIRECT)

Return the detected text exactly as it appears in the original language.

Return a JSON array ONLY (no explanation, no markdown, no code block).
Each item must have these exact fields:
- "text": the exact matched text from the input
- "type": one of "NAME", "ADDRESS", "ORG", "INDIRECT"
- "confidence": number 0-100
- "reason": brief explanation of why this is PII

If nothing is found, return an empty array: []

Text to analyze:
"""
${text}
"""`;

    const result = await model.generateContent(prompt);
    const response = result.response.text().trim();

    // Clean up response (remove code fences if present)
    const cleaned = response
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    const geminiEntities = JSON.parse(cleaned);

    if (!Array.isArray(geminiEntities)) return [];

    // Add position info and replacement fields
    return geminiEntities
      .filter((e) => e.text && e.type && text.includes(e.text))
      .map((e) => {
        const startIndex = text.indexOf(e.text);
        const endIndex = startIndex + e.text.length;
        const replacementMap = {
          NAME: '[NAME]',
          ADDRESS: '[ADDRESS]',
          ORG: '[ORG]',
          INDIRECT: '[INDIRECT]',
        };
        return {
          text: e.text,
          type: e.type,
          confidence: e.confidence || 80,
          reason: e.reason || `Detected by AI as ${e.type}`,
          startIndex,
          endIndex,
          replacement: replacementMap[e.type] || `[${e.type}]`,
          status: 'pending',
        };
      });
  } catch (err) {
    console.error('❌ Gemini API error:', err.message);
    return []; // Graceful fallback — regex results still work
  }
}

/**
 * Translates text to the specified target language safely.
 */
async function translateSafeText(text, targetLanguage = 'English') {
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set. Cannot translate.');
  }
  
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `You are an expert translator. 
Translate the following text into ${targetLanguage}. 
Keep the tone professional. 
DO NOT translate any placeholder tags like [NAME], [EMAIL], [PHONE], etc. Leave them exactly as they are.

Text to translate:
"""
${text}
"""`;

  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}

/**
 * Simulates privacy risk (re-identification) based on redacted text and context.
 */
async function simulatePrivacyRisk(redactedText, context = 'Personal (Default)') {
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set. Cannot run privacy simulation.');
  }
  
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `You are a privacy auditor assessing k-anonymity and indirect re-identification risk.

Analyze the following redacted text. Your goal is to determine if the combination of remaining unredacted information could still allow someone to uniquely identify the person.

CRITICAL INSTRUCTIONS:
1. Pay close attention to indirect identifiers: even if a name is missing, details like roll number, college name, or location present a HIGH risk of the "mosaic effect".
2. Be realistic with your "confidence" score. Do not blindly output 100%.

Return a JSON object ONLY (no explanation, no markdown).
The JSON must have these exact fields:
- "riskLevel": string, strictly one of "Low", "Medium", or "High"
- "confidence": number, 0 to 100
- "suggestions": array of strings, 1-3 short bullet points explicitly showing how remaining unredacted data can indirectly reveal redacted data (e.g., "Age is redacted, but Date of Birth is unredacted. Hide DOB.", or "College is hidden, but Register Number is visible.").

Redacted Text:
"""
${redactedText}
"""`;

  const result = await model.generateContent(prompt);
  const response = result.response.text().trim();

  const cleaned = response
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error('Failed to parse Gemini simulation JSON:', cleaned);
    throw new Error('Failed to parse simulation results.');
  }
}

module.exports = { detectWithGemini, translateSafeText, simulatePrivacyRisk };
