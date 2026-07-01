const mongoose = require('mongoose');

const piiEntitySchema = new mongoose.Schema({
  text: { type: String, required: true },
  type: { type: String, required: true }, // NAME, PHONE, EMAIL, PAN, AADHAAR, ADDRESS, CUSTOM
  confidence: { type: Number, default: 0 },
  reason: { type: String, default: '' },
  startIndex: { type: Number, default: 0 },
  endIndex: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'edited'],
    default: 'pending',
  },
  replacement: { type: String, default: '' }, // e.g. "[NAME]", "[PHONE]"
});

const documentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    originalText: { type: String, required: true },
    redactedText: { type: String, default: '' },
    detectedPII: [piiEntitySchema],
    safeEntities: [{ text: String, reason: String, startIndex: Number, endIndex: Number }],
    stats: {
      total: { type: Number, default: 0 },
      redacted: { type: Number, default: 0 },
      score: { type: Number, default: 100 },
      destination: { type: String, default: 'personal' },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Document', documentSchema);
