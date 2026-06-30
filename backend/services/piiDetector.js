/**
 * Regex-based PII detector for Indian documents.
 * Returns an array of entity objects with position info.
 */

const PII_PATTERNS = [
  {
    type: 'PHONE',
    // Indian mobile: starts 6-9, 10 digits
    pattern: /(?<!\d)([6-9]\d{9})(?!\d)/g,
    confidence: 99,
    reason: 'Matched Indian mobile number format (10 digits starting with 6-9)',
    replacement: '[PHONE]',
  },
  {
    type: 'EMAIL',
    pattern: /([a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,})/g,
    confidence: 98,
    reason: 'Matched standard email address format (user@domain.tld)',
    replacement: '[EMAIL]',
  },
  {
    type: 'PAN',
    // PAN: 5 uppercase letters, 4 digits, 1 uppercase letter
    pattern: /\b([A-Z]{5}[0-9]{4}[A-Z])\b/g,
    confidence: 99,
    reason: 'Matched Indian PAN card format (AAAAA9999A)',
    replacement: '[PAN]',
  },
  {
    type: 'AADHAAR',
    // Aadhaar: 12 digits, optionally separated by spaces/hyphens in groups of 4
    pattern: /\b(\d{4}[\s\-]?\d{4}[\s\-]?\d{4})\b/g,
    confidence: 90,
    reason: 'Matched Aadhaar number format (12 digits, optionally grouped)',
    replacement: '[AADHAAR]',
  },
  {
    type: 'IFSC',
    // IFSC: 4 uppercase letters + 0 + 6 alphanumeric
    pattern: /\b([A-Z]{4}0[A-Z0-9]{6})\b/g,
    confidence: 97,
    reason: 'Matched Indian bank IFSC code format',
    replacement: '[IFSC]',
  },
  {
    type: 'PINCODE',
    // Indian 6-digit pincode
    pattern: /\b([1-9][0-9]{5})\b/g,
    confidence: 75,
    reason: 'Matched Indian 6-digit PIN code format',
    replacement: '[PINCODE]',
  },
  {
    type: 'DATE_OF_BIRTH',
    // DD/MM/YYYY or DD-MM-YYYY
    pattern: /\b(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[0-2])[\/\-](19|20)\d{2}\b/g,
    confidence: 85,
    reason: 'Matched date of birth pattern (DD/MM/YYYY or DD-MM-YYYY)',
    replacement: '[DOB]',
  },
];

/**
 * Run all regex patterns on the input text.
 * Returns deduplicated, sorted entities.
 */
function detectWithRegex(text) {
  const entities = [];
  const seen = new Set();

  for (const { type, pattern, confidence, reason, replacement } of PII_PATTERNS) {
    // Reset lastIndex for global regex
    pattern.lastIndex = 0;
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const matchedText = match[1] || match[0];
      const startIndex = match.index;
      const endIndex = startIndex + matchedText.length;

      // Skip if already detected (same text + same position)
      const key = `${startIndex}-${endIndex}`;
      if (seen.has(key)) continue;
      seen.add(key);

      entities.push({
        text: matchedText,
        type,
        confidence,
        reason,
        startIndex,
        endIndex,
        replacement,
        status: 'pending',
      });
    }
    // Reset after use
    pattern.lastIndex = 0;
  }

  // Sort by position in text
  entities.sort((a, b) => a.startIndex - b.startIndex);
  return entities;
}

module.exports = { detectWithRegex };
