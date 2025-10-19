const { AppError } = require('../utils/errors');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  console.error('Error:', err);

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
    errors: error.errors,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;