const express = require('express');
const router = express.Router();
const {
  getAllGames, getGameBySlug, getFeaturedGames, getTrendingGames,
  getEditorPicks, getLowSpecGames, searchGames, incrementDownload, likeGame
} = require('../controllers/gameController');

router.get('/', getAllGames);
router.get('/search', searchGames);
router.get('/featured', getFeaturedGames);
router.get('/trending', getTrendingGames);
router.get('/editor-picks', getEditorPicks);
router.get('/low-spec', getLowSpecGames);
router.get('/:slug', getGameBySlug);
router.post('/:id/download', incrementDownload);
router.post('/:id/like', likeGame);

module.exports = router;
