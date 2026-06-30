const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const analyzeRoutes = require('./routes/analyze');
const documentRoutes = require('./routes/documents');
const authRoutes = require('./routes/auth');
const uploadRoutes = require('./routes/upload');
const policyRoutes = require('./routes/policies');
const errorHandler = require('./middleware/errorHandler');
const PolicyTemplate = require('./models/PolicyTemplate');
const DEFAULT_TEMPLATES = require('./services/policyTemplates');

const app = express();

// Middleware
app.use(cors({ origin: ['http://localhost:5173', 'https://veiliq.vercel.app', 'https://frontend-two-roan-80.vercel.app'], credentials: true }));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/analyze', analyzeRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/policies', policyRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', app: 'VEILiq' }));

// Error handler (must be last)
app.use(errorHandler);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected');
    // Seed default policy templates if none exist
    const count = await PolicyTemplate.countDocuments();
    if (count === 0) {
      await PolicyTemplate.insertMany(DEFAULT_TEMPLATES);
      console.log(`Seeded ${DEFAULT_TEMPLATES.length} default policy templates.`);
    }
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
  });

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`VEILiq API running on http://localhost:${PORT}`));
}

module.exports = app;
