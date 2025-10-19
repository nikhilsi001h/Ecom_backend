const Address = require('../models/Address');
const { AppError } = require('../utils/errors');
const { successResponse } = require('../utils/response');

exports.create = async (req, res) => {
  const address = await Address.create({
    ...req.body,
    userId: req.user.id
  });

  successResponse(res, { address }, 'Address created successfully', 201);
};

exports.list = async (req, res) => {
  const addresses = await Address.findByUser(req.user.id);
  successResponse(res, { addresses });
};

exports.update = async (req, res, next) => {
  const address = await Address.findById(req.params.id);

  if (!address) {
    return next(new AppError('Address not found', 404));
  }

  if (address.user_id !== req.user.id) {
    return next(new AppError('Not authorized', 403));
  }

  const updatedAddress = await Address.update(req.params.id, req.body);
  successResponse(res, { address: updatedAddress }, 'Address updated successfully');
};

exports.remove = async (req, res, next) => {
  const address = await Address.findById(req.params.id);

  if (!address) {
    return next(new AppError('Address not found', 404));
  }

  if (address.user_id !== req.user.id) {
    return next(new AppError('Not authorized', 403));
  }

  await Address.delete(req.params.id);
  successResponse(res, null, 'Address deleted successfully');
};