const express = require('express');
const router = express.Router();
const { getAllCategories, getCategoryBySlug, getGamesByCategory } = require('../controllers/categoryController');

router.get('/', getAllCategories);
router.get('/:slug', getCategoryBySlug);
router.get('/:slug/games', getGamesByCategory);

module.exports = router;
