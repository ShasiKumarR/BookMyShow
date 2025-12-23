// backend/src/app.js
const express = require('express');
const cors = require('cors');
const db = require('./config/db');
const app = express();

// Load environment variables first
require('dotenv').config();

// Middleware to attach db to request
app.use((req, res, next) => {
  req.db = db;
  next();
});

// CORS configuration
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// Routes
const seatRoutes = require('./routes/seatRoutes');
app.use('/api', seatRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'UP', message: 'BookMyShow API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

module.exports = app;