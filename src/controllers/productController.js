const Product = require('../models/Product');
const { AppError } = require('../utils/errors');
const { successResponse } = require('../utils/response');

exports.listProducts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;

  const filters = {};
  if (req.query.category) filters.category = parseInt(req.query.category);
  if (req.query.priceMin) filters.priceMin = parseFloat(req.query.priceMin);
  if (req.query.priceMax) filters.priceMax = parseFloat(req.query.priceMax);
  if (req.query.vendor) filters.vendor = parseInt(req.query.vendor);
  if (req.query.q) filters.search = req.query.q;
  if (req.query.sort) filters.sort = req.query.sort;

  const products = await Product.findAll(filters, limit, offset);
  const total = await Product.count(filters);

  successResponse(res, { products }, 'Products retrieved', 200, {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit)
  });
};

exports.getProduct = async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  await Product.incrementViews(req.params.id);

  successResponse(res, { product });
};

exports.createProduct = async (req, res) => {
  const productData = {
    ...req.body,
    vendorId: req.user.role === 'vendor' ? req.user.id : null
  };

  const product = await Product.create(productData);
  successResponse(res, { product }, 'Product created successfully', 201);
};

exports.updateProduct = async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  if (req.user.role === 'vendor' && product.vendor_id !== req.user.id) {
    return next(new AppError('Not authorized to update this product', 403));
  }

  product = await Product.update(req.params.id, req.body);
  successResponse(res, { product }, 'Product updated successfully');
};

exports.deleteProduct = async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  if (req.user.role === 'vendor' && product.vendor_id !== req.user.id) {
    return next(new AppError('Not authorized to delete this product', 403));
  }

  await Product.delete(req.params.id);
  successResponse(res, null, 'Product deleted successfully');
};

exports.featuredProducts = async (req, res) => {
  const products = await Product.findAll({ featured: true }, 10, 0);
  successResponse(res, { products });
};

exports.trendingProducts = async (req, res) => {
  const products = await Product.findAll({ sort: '-views' }, 10, 0);
  successResponse(res, { products });
};

exports.newArrivals = async (req, res) => {
  const products = await Product.findAll({ sort: '-created_at' }, 10, 0);
  successResponse(res, { products });
};