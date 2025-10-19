const Category = require('../models/Category');
const { AppError } = require('../utils/errors');
const { successResponse } = require('../utils/response');

exports.list = async (req, res) => {
  const categories = await Category.findAll();
  successResponse(res, { categories });
};

exports.create = async (req, res) => {
  const category = await Category.create(req.body);
  successResponse(res, { category }, 'Category created successfully', 201);
};

exports.update = async (req, res, next) => {
  const category = await Category.update(req.params.id, req.body);

  if (!category) {
    return next(new AppError('Category not found', 404));
  }

  successResponse(res, { category }, 'Category updated successfully');
};

exports.remove = async (req, res, next) => {
  const category = await Category.delete(req.params.id);

  if (!category) {
    return next(new AppError('Category not found', 404));
  }

  successResponse(res, null, 'Category deleted successfully');
};