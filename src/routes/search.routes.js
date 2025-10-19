const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');
const rateLimit = require('../middlewares/ratelimit');

router.get('/', rateLimit('anon'), searchController.searchProducts);

module.exports = router;