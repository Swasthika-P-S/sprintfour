const PolicyTemplate = require('../models/PolicyTemplate');

/**
 * GET /api/policies
 * Returns all policy templates (id, label, icon, description, keep, review, alwaysHide)
 */
async function getAllPolicies(req, res, next) {
  try {
    const policies = await PolicyTemplate.find().sort({ label: 1 });
    return res.json({ policies });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/policies/:id
 * Returns a single policy template by its short id (e.g. 'healthcare')
 */
async function getPolicyById(req, res, next) {
  try {
    const policy = await PolicyTemplate.findOne({ id: req.params.id });
    if (!policy) {
      return res.status(404).json({ error: `Policy template "${req.params.id}" not found.` });
    }
    return res.json({ policy });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/policies
 * Creates a new policy template (admin use / future extensibility)
 * Body: { id, label, icon, description, keep, review, alwaysHide }
 */
async function createPolicy(req, res, next) {
  try {
    const { id, label, icon, description, keep, review, alwaysHide } = req.body;
    if (!id || !label) {
      return res.status(400).json({ error: 'id and label are required.' });
    }
    const existing = await PolicyTemplate.findOne({ id });
    if (existing) {
      return res.status(409).json({ error: `A policy with id "${id}" already exists.` });
    }
    const policy = new PolicyTemplate({ id, label, icon, description, keep, review, alwaysHide });
    const saved = await policy.save();
    return res.status(201).json({ policy: saved });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/policies/:id
 * Updates an existing policy template
 */
async function updatePolicy(req, res, next) {
  try {
    const policy = await PolicyTemplate.findOneAndUpdate(
      { id: req.params.id },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!policy) {
      return res.status(404).json({ error: `Policy "${req.params.id}" not found.` });
    }
    return res.json({ policy });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAllPolicies, getPolicyById, createPolicy, updatePolicy };
