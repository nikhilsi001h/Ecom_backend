const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');

router.put('/:id', auth.jwtAuth, validate('review.create'), reviewController.update);
router.delete('/:id', auth.jwtAuth, reviewController.remove);

module.exports = router;