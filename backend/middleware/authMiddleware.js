const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function protect(req, res, next) {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) return res.status(401).json({ error: 'Not authenticated. Please sign in.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'privacylens_super_secret_key_2024_hackathon');
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) return res.status(401).json({ error: 'User not found.' });
    next();
  } catch {
    res.status(401).json({ error: 'Token invalid or expired. Please sign in again.' });
  }
}

module.exports = { protect };
