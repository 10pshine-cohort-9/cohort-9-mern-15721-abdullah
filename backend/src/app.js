const express = require('express');
const cors = require('cors');
const logger = require('./logger');
const authRoutes = require('./routes/auth.routes');
const notesRoutes = require('./routes/notes.routes');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Global error handler
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  logger.error(err);
  const status = err.status || 500;
  const message = status < 500 ? err.message : 'Internal Server Error';

  res.status(status).json({
    error: message
  });
});

module.exports = app;
