const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');

router.get('/', auth.jwtAuth, wishlistController.getWishlist);
router.post('/', auth.jwtAuth, validate('wishlist.add'), wishlistController.add);
router.delete('/:productId', auth.jwtAuth, wishlistController.remove);

module.exports = router;