const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const reviewController = require('../controllers/reviewController');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const rateLimit = require('../middlewares/ratelimit');

router.get('/', rateLimit('anon'), productController.listProducts);
router.get('/featured', productController.featuredProducts);
router.get('/trending', productController.trendingProducts);
router.get('/new', productController.newArrivals);
router.get('/:id', rateLimit('anon'), productController.getProduct);

// Reviews
router.get('/:id/reviews', reviewController.getByProduct);
router.post('/:id/reviews', auth.jwtAuth, validate('review.create'), reviewController.createForProduct);

// Admin/Vendor only
router.post('/', auth.jwtAuth, auth.requireRole('admin', 'vendor'), validate('product.create'), productController.createProduct);
router.put('/:id', auth.jwtAuth, auth.requireRole('admin', 'vendor'), validate('product.update'), productController.updateProduct);
router.delete('/:id', auth.jwtAuth, auth.requireRole('admin', 'vendor'), productController.deleteProduct);

module.exports = router;