const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');

router.get('/', auth.jwtAuth, orderController.listUserOrders);
router.get('/admin/all', auth.jwtAuth, auth.requireRole('admin'), orderController.listAllOrders);
router.get('/:id', auth.jwtAuth, orderController.getOrder);
router.post('/', auth.jwtAuth, validate('order.create'), orderController.createOrder);
router.put('/:id/cancel', auth.jwtAuth, orderController.cancelOrder);
router.put('/admin/:id/status', auth.jwtAuth, auth.requireRole('admin'), orderController.updateStatus);
router.put('/admin/:id/assign-shipment', auth.jwtAuth, auth.requireRole('admin'), orderController.assignShipment);

module.exports = router;