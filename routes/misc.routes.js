const express = require('express');
const router = express.Router();
const miscController = require('../controllers/misc.controller');
const secure = require('../middlewares/auth.middleware');


// HOME
router.get('/', miscController.test);
router.get('/home', miscController.list);
router.get('/resultados', secure.isAuthenticated, miscController.results)

module.exports = router;