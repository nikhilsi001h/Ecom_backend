const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { AppError } = require('../utils/errors');
const jwtConfig = require('../config/jwt');

exports.jwtAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new AppError('Please log in to access this resource', 401);
    }

    const decoded = jwt.verify(token, jwtConfig.secret);

    const user = await User.findById(decoded.id);
    if (!user) {
      throw new AppError('User no longer exists', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new AppError('Invalid token', 401));
    }
    if (error.name === 'TokenExpiredError') {
      return next(new AppError('Token expired', 401));
    }
    next(error);
  }
};

exports.optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      const decoded = jwt.verify(token, jwtConfig.secret);
      const user = await User.findById(decoded.id);
      if (user) {
        req.user = user;
      }
    }
    next();
  } catch (error) {
    next();
  }
};

exports.requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Please log in to access this resource', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }

    next();
  };
};

exports.generateToken = (id) => {
  return jwt.sign({ id }, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn
  });
};