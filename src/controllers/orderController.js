const Order = require('../models/Order');
const Product = require('../models/Product');
const { AppError } = require('../utils/errors');
const { successResponse } = require('../utils/response');

exports.listUserOrders = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const orders = await Order.findByUser(req.user.id, limit, offset);
  const total = await Order.countByUser(req.user.id);

  successResponse(res, { orders }, 'Orders retrieved', 200, {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit)
  });
};

exports.getOrder = async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  if (order.user_id !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to view this order', 403));
  }

  successResponse(res, { order });
};

exports.createOrder = async (req, res, next) => {
  const { items, shippingAddress, paymentMethod } = req.body;

  if (!items || items.length === 0) {
    return next(new AppError('No order items', 400));
  }

  // Verify stock for all items
  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) {
      return next(new AppError(`Product ${item.product} not found`, 404));
    }
    if (product.stock < item.quantity) {
      return next(new AppError(`Insufficient stock for ${product.name}`, 400));
    }
  }

  const itemsPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const taxPrice = itemsPrice * 0.1; // 10% tax
  const shippingPrice = itemsPrice > 100 ? 0 : 15;
  const totalPrice = itemsPrice + taxPrice + shippingPrice;

  const order = await Order.create({
    userId: req.user.id,
    items,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice
  });

  successResponse(res, { order }, 'Order created successfully', 201);
};

exports.cancelOrder = async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  if (order.user_id !== req.user.id) {
    return next(new AppError('Not authorized to cancel this order', 403));
  }

  if (order.status !== 'pending') {
    return next(new AppError('Cannot cancel order in current status', 400));
  }

  const updatedOrder = await Order.cancel(req.params.id);
  successResponse(res, { order: updatedOrder }, 'Order cancelled successfully');
};

exports.listAllOrders = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;

  const filters = {};
  if (req.query.status) {
    filters.status = req.query.status;
  }

  const orders = await Order.findAll(filters, limit, offset);
  const total = await Order.count(filters);

  successResponse(res, { orders }, 'Orders retrieved', 200, {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit)
  });
};

exports.updateStatus = async (req, res, next) => {
  const { status } = req.body;

  const order = await Order.updateStatus(req.params.id, status);

  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  successResponse(res, { order }, 'Order status updated');
};

exports.assignShipment = async (req, res, next) => {
  const { trackingNumber } = req.body;

  const order = await Order.updateTracking(req.params.id, trackingNumber);

  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  successResponse(res, { order }, 'Shipment assigned successfully');
};