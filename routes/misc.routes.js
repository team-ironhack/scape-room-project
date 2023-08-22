const express = require('express');
const router = express.Router();
const miscController = require('../controllers/misc.controller');
const secure = require('../middlewares/auth.middleware');


// HOME
router.get('/', miscController.test);
router.get('/home', miscController.list);
router.get('/resultados', secure.isAuthenticated, miscController.results)

// LIKES
router.post('/likes/:playerId/:roomId', secure.isAuthenticated, miscController.likeCreate);

// GUARDADOS

router.post('/marks/:playerId/:roomId', secure.isAuthenticated, miscController.markCreate);

// HECHOS 

router.post('/dones/:playerId/:roomId', secure.isAuthenticated, miscController.doneCreate);

// COMENTARIOS 

router.post('/comment/delete/:id', secure.isAuthenticated, miscController.deleteComment);
router.post('/comments/:id', secure.isAuthenticated, miscController.doComment);


module.exports = router;