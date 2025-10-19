const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const addressController = require('../controllers/addressController');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');

router.get('/me', auth.jwtAuth, userController.getMe);
router.put('/me', auth.jwtAuth, validate('user.updateMe'), userController.updateMe);
router.put('/me/change-password', auth.jwtAuth, validate('user.changePassword'), userController.changePassword);

// Addresses
router.post('/me/addresses', auth.jwtAuth, validate('address.create'), addressController.create);
router.get('/me/addresses', auth.jwtAuth, addressController.list);
router.put('/me/addresses/:id', auth.jwtAuth, addressController.update);
router.delete('/me/addresses/:id', auth.jwtAuth, addressController.remove);

// Admin only
router.get('/', auth.jwtAuth, auth.requireRole('admin'), userController.listUsers);
router.get('/:id', auth.jwtAuth, auth.requireRole('admin'), userController.getUserById);
router.put('/:id/role', auth.jwtAuth, auth.requireRole('admin'), userController.updateUserRole);

module.exports = router;