const mongoose = require('mongoose');

/**
 * A single field rule within a category
 */
const fieldRuleSchema = new mongoose.Schema({
  label: { type: String, required: true },   // Human-readable label e.g. "Patient Name"
  piiTypes: [{ type: String }],               // Maps to PII entity types e.g. ['NAME']
}, { _id: false });

/**
 * The full policy template for one context
 */
const policyTemplateSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // e.g. 'healthcare'
  label: { type: String, required: true },             // e.g. 'Healthcare'
  icon: { type: String, default: '📋' },
  description: { type: String, default: '' },
  keep:       [fieldRuleSchema],
  review:     [fieldRuleSchema],
  alwaysHide: [fieldRuleSchema],
}, { timestamps: true });

module.exports = mongoose.model('PolicyTemplate', policyTemplateSchema);
