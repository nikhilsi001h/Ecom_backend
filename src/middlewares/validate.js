const Joi = require('joi');
const { AppError } = require('../utils/errors');

const schemas = {
  'auth.register': Joi.object({
    name: Joi.string().required().min(2).max(100),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6),
    phone: Joi.string().optional()
  }),
  'auth.login': Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),
  'user.updateMe': Joi.object({
    name: Joi.string().min(2).max(100),
    phone: Joi.string(),
    avatar: Joi.string().uri()
  }),
  'user.changePassword': Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().required().min(6)
  }),
  'product.create': Joi.object({
    name: Joi.string().required().min(3).max(200),
    description: Joi.string().required(),
    price: Joi.number().required().min(0),
    comparePrice: Joi.number().min(0),
    categoryId: Joi.number().integer().required(),
    brand: Joi.string(),
    stock: Joi.number().integer().min(0).required(),
    tags: Joi.array().items(Joi.string())
  }),
  'product.update': Joi.object({
    name: Joi.string().min(3).max(200),
    description: Joi.string(),
    price: Joi.number().min(0),
    stock: Joi.number().integer().min(0),
    is_active: Joi.boolean()
  }),
  'category.create': Joi.object({
    name: Joi.string().required(),
    description: Joi.string(),
    image: Joi.string().uri(),
    parentId: Joi.number().integer()
  }),
  'cart.add': Joi.object({
    productId: Joi.number().integer().required(),
    quantity: Joi.number().integer().min(1).required()
  }),
  'cart.updateItem': Joi.object({
    quantity: Joi.number().integer().min(1).required()
  }),
  'order.create': Joi.object({
    items: Joi.array().items(Joi.object({
      product: Joi.number().integer().required(),
      quantity: Joi.number().integer().min(1).required(),
      price: Joi.number().min(0).required(),
      name: Joi.string().required()
    })).required(),
    shippingAddress: Joi.object({
      street: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      zipCode: Joi.string().required(),
      country: Joi.string().required(),
      phone: Joi.string().required()
    }).required(),
    paymentMethod: Joi.string().valid('card', 'paypal', 'cod').required()
  }),
  'review.create': Joi.object({
    rating: Joi.number().integer().min(1).max(5).required(),
    comment: Joi.string().required().min(10)
  }),
  'wishlist.add': Joi.object({
    productId: Joi.number().integer().required()
  }),
  'address.create': Joi.object({
    fullName: Joi.string().required(),
    phone: Joi.string().required(),
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    zipCode: Joi.string().required(),
    country: Joi.string().required(),
    isDefault: Joi.boolean()
  })
};

module.exports = (schemaName) => {
  return (req, res, next) => {
    const schema = schemas[schemaName];
    
    if (!schema) {
      return next();
    }

    const { error, value } = schema.validate(req.body, { 
      abortEarly: false,
      stripUnknown: true 
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      return next(new AppError('Validation failed', 400, errors));
    }

    req.body = value;
    next();
  };
};