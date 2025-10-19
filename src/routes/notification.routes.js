const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const auth = require('../middlewares/auth');

router.get('/', auth.jwtAuth, notificationController.list);
router.put('/:id/read', auth.jwtAuth, notificationController.markRead);
router.put('/read-all', auth.jwtAuth, notificationController.markAllRead);

module.exports = router;