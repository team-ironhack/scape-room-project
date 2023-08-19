const express = require('express');
const router = express.Router();
const miscController = require('../controllers/misc.controller');
const likesController = require('../controllers/likes.controller')
const secure = require('../middlewares/auth.middleware');


// HOME
router.get('/', miscController.test);
router.get('/home', miscController.list);
router.get('/resultados', secure.isAuthenticated, miscController.results)

// LIKES
router.post('/likes/:playerId/:roomId', secure.isAuthenticated, likesController.create);


module.exports = router;