const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const { AppError } = require('../utils/errors');
const { successResponse } = require('../utils/response');

exports.getWishlist = async (req, res) => {
  let wishlist = await Wishlist.findByUser(req.user.id);

  if (!wishlist) {
    wishlist = await Wishlist.createForUser(req.user.id);
    wishlist.products = [];
  }

  successResponse(res, { wishlist });
};

exports.add = async (req, res, next) => {
  const { productId } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  try {
    await Wishlist.addProduct(req.user.id, productId);
    const wishlist = await Wishlist.findByUser(req.user.id);
    successResponse(res, { wishlist }, 'Product added to wishlist');
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};

exports.remove = async (req, res, next) => {
  const { productId } = req.params;

  await Wishlist.removeProduct(req.user.id, parseInt(productId));
  const wishlist = await Wishlist.findByUser(req.user.id);

  successResponse(res, { wishlist }, 'Product removed from wishlist');
};