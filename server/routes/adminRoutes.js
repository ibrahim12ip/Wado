const express = require('express');
const router = express.Router();
const { adminAuth } = require('../middleware/auth');
const {
  createGame, updateGame, deleteGame,
  getSliders, createSlider, updateSlider, deleteSlider,
  getUsers, banUser, unbanUser, setUserRole,
  getAdverts, createAdvert, updateAdvert, deleteAdvert,
  createCategory, updateCategory, deleteCategory,
  createBlog, updateBlog, deleteBlog,
  getComments, deleteComment, getDashboardStats
} = require('../controllers/adminController');

const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// Dashboard
router.get('/dashboard', adminAuth, asyncHandler(getDashboardStats));

// Oyun
router.post('/games', adminAuth, asyncHandler(createGame));
router.put('/games/:id', adminAuth, asyncHandler(updateGame));
router.delete('/games/:id', adminAuth, asyncHandler(deleteGame));

// Slider
router.get('/sliders', adminAuth, asyncHandler(getSliders));
router.post('/sliders', adminAuth, asyncHandler(createSlider));
router.put('/sliders/:id', adminAuth, asyncHandler(updateSlider));
router.delete('/sliders/:id', adminAuth, asyncHandler(deleteSlider));

// Kullanıcı
router.get('/users', adminAuth, asyncHandler(getUsers));
router.put('/users/:id/ban', adminAuth, asyncHandler(banUser));
router.put('/users/:id/unban', adminAuth, asyncHandler(unbanUser));
router.put('/users/:id/role', adminAuth, asyncHandler(setUserRole));

// Reklam
router.get('/adverts', adminAuth, asyncHandler(getAdverts));
router.post('/adverts', adminAuth, asyncHandler(createAdvert));
router.put('/adverts/:id', adminAuth, asyncHandler(updateAdvert));
router.delete('/adverts/:id', adminAuth, asyncHandler(deleteAdvert));

// Kategori
router.post('/categories', adminAuth, asyncHandler(createCategory));
router.put('/categories/:id', adminAuth, asyncHandler(updateCategory));
router.delete('/categories/:id', adminAuth, asyncHandler(deleteCategory));

// Blog
router.post('/blogs', adminAuth, asyncHandler(createBlog));
router.put('/blogs/:id', adminAuth, asyncHandler(updateBlog));
router.delete('/blogs/:id', adminAuth, asyncHandler(deleteBlog));

// Yorum
router.get('/comments', adminAuth, asyncHandler(getComments));
router.delete('/comments/:id', adminAuth, asyncHandler(deleteComment));

module.exports = router;
