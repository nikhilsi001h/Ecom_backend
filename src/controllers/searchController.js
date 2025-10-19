const Product = require('../models/Product');
const { successResponse } = require('../utils/response');

exports.searchProducts = async (req, res) => {
  const { q, category, priceMin, priceMax, page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;

  const filters = {};
  if (q) filters.search = q;
  if (category) filters.category = parseInt(category);
  if (priceMin) filters.priceMin = parseFloat(priceMin);
  if (priceMax) filters.priceMax = parseFloat(priceMax);

  const products = await Product.findAll(filters, parseInt(limit), offset);
  const total = await Product.count(filters);

  successResponse(res, { products }, 'Search results', 200, {
    page: parseInt(page),
    limit: parseInt(limit),
    total,
    pages: Math.ceil(total / limit)
  });
};