const Vendor = require('../models/Vendor');
const { AppError } = require('../utils/errors');
const { successResponse } = require('../utils/response');
const { generateToken } = require('../middlewares/auth');

exports.register = async (req, res, next) => {
  const { businessName, email, password, phone } = req.body;

  const existingVendor = await Vendor.findByEmail(email);
  if (existingVendor) {
    return next(new AppError('Email already registered', 400));
  }

  const vendor = await Vendor.create({ businessName, email, password, phone });
  const token = generateToken(vendor.id);

  successResponse(res, {
    vendor: {
      id: vendor.id,
      businessName: vendor.business_name,
      email: vendor.email
    },
    token
  }, 'Vendor registered successfully', 201);
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  const vendor = await Vendor.findByEmail(email);
  if (!vendor) {
    return next(new AppError('Invalid email or password', 401));
  }

  const isValidPassword = await Vendor.comparePassword(password, vendor.password);
  if (!isValidPassword) {
    return next(new AppError('Invalid email or password', 401));
  }

  const token = generateToken(vendor.id);

  successResponse(res, {
    vendor: {
      id: vendor.id,
      businessName: vendor.business_name,
      email: vendor.email
    },
    token
  }, 'Login successful');
};

exports.getMe = async (req, res) => {
  const vendor = await Vendor.findById(req.user.id);
  successResponse(res, { vendor });
};