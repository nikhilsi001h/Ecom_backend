const User = require('../models/User');
const { AppError } = require('../utils/errors');
const { successResponse } = require('../utils/response');

exports.getMe = async (req, res) => {
  const user = await User.findById(req.user.id);
  successResponse(res, { user });
};

exports.updateMe = async (req, res) => {
  const { name, phone, avatar } = req.body;
  const user = await User.update(req.user.id, { name, phone, avatar });
  successResponse(res, { user }, 'Profile updated successfully');
};

exports.changePassword = async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findByEmail(req.user.email);
  
  const isValidPassword = await User.comparePassword(currentPassword, user.password);
  if (!isValidPassword) {
    return next(new AppError('Current password is incorrect', 400));
  }

  await User.updatePassword(req.user.id, newPassword);
  successResponse(res, null, 'Password changed successfully');
};

exports.listUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;

  const users = await User.findAll(limit, offset);
  const total = await User.count();

  successResponse(res, { users }, 'Users retrieved', 200, {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit)
  });
};

exports.getUserById = async (req, res, next) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  successResponse(res, { user });
};

exports.updateUserRole = async (req, res, next) => {
  const { role } = req.body;

  const user = await User.updateRole(req.params.id, role);

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  successResponse(res, { user }, 'User role updated successfully');
};