const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// POST /api/auth/register
async function register(req, res, next) {
  try {
    const { name, email, password, dob, guardianName, guardianEmail } = req.body;

    if (!name || !email || !password || !dob)
      return res.status(400).json({ error: 'Name, email, password and date of birth are required.' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ error: 'An account with this email already exists.' });

    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
    if (age < 14) {
      return res.status(400).json({ error: 'You must be at least 14 years old to register.' });
    }
    const isMinor = false;

    const user = await User.create({
      name,
      email,
      password,
      dob: birthDate,
      isMinor,
      guardianName: isMinor ? guardianName : '',
      guardianEmail: isMinor ? guardianEmail : '',
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isMinor: user.isMinor,
      token: generateToken(user._id),
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/login
async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'Email and password are required.' });

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ error: 'Invalid email or password.' });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isMinor: user.isMinor,
      token: generateToken(user._id),
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/auth/me
async function getMe(req, res) {
  const user = req.user;
  res.json({ _id: user._id, name: user.name, email: user.email, isMinor: user.isMinor });
}

module.exports = { register, login, getMe };
