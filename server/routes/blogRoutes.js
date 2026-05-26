const express = require('express');
const router = express.Router();
const { getAllBlogs, getBlogBySlug, getFeaturedBlogs } = require('../controllers/blogController');

router.get('/', getAllBlogs);
router.get('/featured', getFeaturedBlogs);
router.get('/:slug', getBlogBySlug);

module.exports = router;
