const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const rateLimit = require('../middlewares/rateLimit');

router.post('/register', rateLimit('slow'), validate('auth.register'), authController.register);
router.post('/login', rateLimit('auth'), validate('auth.login'), authController.login);
router.post('/logout', auth.jwtAuth, authController.logout);

module.exports = router;