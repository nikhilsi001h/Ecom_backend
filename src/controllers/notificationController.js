const Notification = require('../models/Notification');
const { successResponse } = require('../utils/response');
const { AppError } = require('../utils/errors');

exports.list = async (req, res) => {
  const notifications = await Notification.findByUser(req.user.id);
  successResponse(res, { notifications });
};

exports.markRead = async (req, res, next) => {
  const notification = await Notification.markAsRead(req.params.id);

  if (!notification) {
    return next(new AppError('Notification not found', 404));
  }

  successResponse(res, { notification });
};

exports.markAllRead = async (req, res) => {
  await Notification.markAllAsRead(req.user.id);
  successResponse(res, null, 'All notifications marked as read');
};