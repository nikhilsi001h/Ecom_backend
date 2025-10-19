const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
require('express-async-errors');

const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const requestId = require('./middlewares/requestId');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Add request ID to all requests
app.use(requestId);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'success', 
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    database: 'Mock Data (In-Memory)'
  });
});

// Root route handler
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running!'
  });
});

// API routes
app.use('/api', routes);

// 404 handler
app.all('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Can't find ${req.originalUrl} on this server!`
  });
});

// Global error handler
app.use(errorHandler);

module.exports = app;