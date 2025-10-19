const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorController');
const auth = require('../middlewares/auth');
const rateLimit = require('../middlewares/rateLimit');

router.post('/register', rateLimit('slow'), vendorController.register);
router.post('/login', vendorController.login);
router.get('/me', auth.jwtAuth, auth.requireRole('vendor'), vendorController.getMe);

module.exports = router;