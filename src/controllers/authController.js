const User = require('../models/User');
const { AppError } = require('../utils/errors');
const { successResponse } = require('../utils/response');
const { generateToken } = require('../middlewares/auth');

exports.register = async (req, res, next) => {
  const { name, email, password, phone } = req.body;

  const existingUser = await User.findByEmail(email);
  if (existingUser) {
    return next(new AppError('Email already registered', 400));
  }

  const user = await User.create({ name, email, password, phone });
  const token = generateToken(user.id);

  successResponse(res, {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    token
  }, 'User registered successfully', 201);
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findByEmail(email);
  if (!user) {
    return next(new AppError('Invalid email or password', 401));
  }

  const isValidPassword = await User.comparePassword(password, user.password);
  if (!isValidPassword) {
    return next(new AppError('Invalid email or password', 401));
  }

  const token = generateToken(user.id);

  successResponse(res, {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    token
  }, 'Login successful');
};

exports.logout = async (req, res) => {
  successResponse(res, null, 'Logout successful');
};