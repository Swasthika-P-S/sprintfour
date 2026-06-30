const express = require('express');
const { getAllPolicies, getPolicyById, createPolicy, updatePolicy } = require('../controllers/policyController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/',     protect, getAllPolicies);
router.get('/:id',  protect, getPolicyById);
router.post('/',    protect, createPolicy);
router.put('/:id',  protect, updatePolicy);

module.exports = router;
