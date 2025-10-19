const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');

router.get('/', categoryController.list);
router.post('/', auth.jwtAuth, auth.requireRole('admin'), validate('category.create'), categoryController.create);
router.put('/:id', auth.jwtAuth, auth.requireRole('admin'), categoryController.update);
router.delete('/:id', auth.jwtAuth, auth.requireRole('admin'), categoryController.remove);

module.exports = router;