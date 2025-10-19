const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { AppError } = require('../utils/errors');
const { successResponse } = require('../utils/response');

exports.getCart = async (req, res) => {
  let cart = await Cart.findByUser(req.user.id);

  if (!cart) {
    cart = await Cart.createForUser(req.user.id);
    cart.items = [];
  }

  successResponse(res, { cart });
};

exports.addItem = async (req, res, next) => {
  const { productId, quantity } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  if (product.stock < quantity) {
    return next(new AppError('Insufficient stock', 400));
  }

  await Cart.addItem(req.user.id, productId, quantity, product.price);
  const cart = await Cart.findByUser(req.user.id);

  successResponse(res, { cart }, 'Item added to cart');
};

exports.updateItem = async (req, res, next) => {
  const { quantity } = req.body;
  const { itemId } = req.params;

  await Cart.updateItem(itemId, quantity);
  const cart = await Cart.findByUser(req.user.id);

  successResponse(res, { cart }, 'Cart item updated');
};

exports.removeItem = async (req, res, next) => {
  const { itemId } = req.params;

  await Cart.removeItem(itemId);
  const cart = await Cart.findByUser(req.user.id);

  successResponse(res, { cart }, 'Item removed from cart');
};

exports.clearCart = async (req, res) => {
  await Cart.clear(req.user.id);
  const cart = await Cart.findByUser(req.user.id);

  successResponse(res, { cart }, 'Cart cleared');
};