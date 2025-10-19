const Review = require('../models/Review');
const Product = require('../models/Product');
const { AppError } = require('../utils/errors');
const { successResponse } = require('../utils/response');

exports.getByProduct = async (req, res) => {
  const reviews = await Review.findByProduct(req.params.id);
  successResponse(res, { reviews });
};

exports.createForProduct = async (req, res, next) => {
  const { rating, comment } = req.body;
  const productId = parseInt(req.params.id);

  const product = await Product.findById(productId);
  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  const existingReview = await Review.checkExisting(productId, req.user.id);
  if (existingReview) {
    return next(new AppError('You have already reviewed this product', 400));
  }

  const review = await Review.create({
    productId,
    userId: req.user.id,
    rating,
    comment
  });

  // Update product rating
  await Product.updateRating(productId);

  successResponse(res, { review }, 'Review created successfully', 201);
};

exports.update = async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new AppError('Review not found', 404));
  }

  if (review.user_id !== req.user.id) {
    return next(new AppError('Not authorized to update this review', 403));
  }

  const { rating, comment } = req.body;
  const updatedReview = await Review.update(req.params.id, { rating, comment });

  // Update product rating
  await Product.updateRating(review.product_id);

  successResponse(res, { review: updatedReview }, 'Review updated');
};

exports.remove = async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new AppError('Review not found', 404));
  }

  if (review.user_id !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to delete this review', 403));
  }

  const result = await Review.delete(req.params.id);

  // Update product rating
  await Product.updateRating(result.product_id);

  successResponse(res, null, 'Review deleted');
};