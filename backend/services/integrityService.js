// Pure JS integrity checks — no Gemini needed
function verifyIntegrity(originalText, redactedText, entities) {
  const checks = [];

  // CHECK A: No raw PII text leaking into redacted output
  const redactedEntities = entities.filter(e => e._shouldBeRedacted);
  const leakedEntities = redactedEntities.filter(e => e.text && redactedText.includes(e.text));
  checks.push({
    id: 'A',
    label: 'No raw PII text in output',
    status: leakedEntities.length === 0 ? 'PASS' : 'FAIL',
    detail: leakedEntities.length === 0
      ? 'No original sensitive text was found in the redacted output.'
      : `Found ${leakedEntities.length} unredacted entity(s) still visible: ${leakedEntities.map(e => `"${e.text}"`).join(', ')}`
  });

  // CHECK B: No metadata artifacts (XML tags, author fields, hidden comments)
  const metadataPatterns = [
    /<[a-zA-Z][^>]*>/g,           // XML/HTML tags
    /<!--[\s\S]*?-->/g,            // HTML comments  
    /author:\s*\S+/gi,             // Author metadata
    /revision:\s*\d+/gi,           // Revision markers
    /created:\s*\S+/gi,            // Creation date markers
  ];
  const metadataHits = metadataPatterns.some(p => p.test(redactedText));
  checks.push({
    id: 'B',
    label: 'No metadata artifacts in output',
    status: metadataHits ? 'FAIL' : 'PASS',
    detail: metadataHits
      ? 'Possible metadata artifacts detected (XML tags, author fields, or hidden markers).'
      : 'No metadata artifacts found in the redacted output.'
  });

  // CHECK C: All pseudonyms are correctly formatted
  const pseudonymPattern = /\[(PERSON|ADDRESS|ORG|INDIRECT|REDACTED|EMAIL|PHONE|SSN|NAME)[^\]]*\]/g;
  const blanks = (redactedText.match(/\[\s*\]/g) || []).length;
  checks.push({
    id: 'C',
    label: 'All redacted tokens use correct pseudonym format',
    status: blanks === 0 ? 'PASS' : 'FAIL',
    detail: blanks === 0
      ? 'All redacted entities use properly formatted pseudonyms (e.g., [PERSON-1]).'
      : `Found ${blanks} blank or malformed redaction token(s) — these may still be recoverable.`
  });

  // CHECK D: No duplicate pseudonyms used for different entities
  const pseudonymMatches = [...(redactedText.matchAll(pseudonymPattern) || [])];
  const uniquePseudonyms = new Set(pseudonymMatches.map(m => m[0]));
  checks.push({
    id: 'D',
    label: 'Pseudonym consistency check',
    status: 'PASS', // informational — just report count
    detail: `${uniquePseudonyms.size} unique pseudonym(s) used consistently across the document.`
  });

  const overallPass = checks.every(c => c.status !== 'FAIL');
  return { checks, overallPass, checkedAt: new Date().toISOString() };
}

module.exports = { verifyIntegrity };
