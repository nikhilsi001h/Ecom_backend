const Vendor = require('../models/Vendor');
const User = require('../models/User');
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
  const token = generateToken(vendor.user_id);

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

  // IMPORTANT: Generate token with user_id, not vendor.id
  const token = generateToken(vendor.user_id);

  successResponse(res, {
    vendor: {
      id: vendor.id,
      userId: vendor.user_id,
      businessName: vendor.business_name,
      email: vendor.email
    },
    token
  }, 'Login successful');
};

exports.getMe = async (req, res) => {
  // req.user is set by auth middleware (contains user data)
  // Find the vendor record associated with this user
  const vendor = await Vendor.findByUserId(req.user.id);
  
  if (!vendor) {
    return next(new AppError('Vendor profile not found', 404));
  }

  successResponse(res, { 
    vendor: {
      id: vendor.id,
      userId: vendor.user_id,
      businessName: vendor.business_name,
      email: vendor.email,
      phone: vendor.phone,
      description: vendor.description,
      isVerified: vendor.is_verified,
      isActive: vendor.is_active,
      rating: vendor.rating,
      totalSales: vendor.total_sales,
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role
      }
    }
  });
};