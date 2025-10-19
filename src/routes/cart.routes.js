const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');

router.get('/', auth.jwtAuth, cartController.getCart);
router.post('/', auth.jwtAuth, validate('cart.add'), cartController.addItem);
router.put('/:itemId', auth.jwtAuth, validate('cart.updateItem'), cartController.updateItem);
router.delete('/:itemId', auth.jwtAuth, cartController.removeItem);
router.delete('/', auth.jwtAuth, cartController.clearCart);

module.exports = router;