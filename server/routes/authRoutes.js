const express = require('express');
const router = express.Router();
const { register, login, getMe, updateProfile, addFavorite, rateGame } = require('../controllers/authController');
const { auth } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, getMe);
router.put('/profile', auth, updateProfile);
router.post('/favorites/:gameId', auth, addFavorite);
router.post('/rate/:gameId', auth, rateGame);

module.exports = router;
