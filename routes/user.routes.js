const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller')
const secure = require('../middlewares/auth.middleware')

router.get('/player/profile/:id', secure.isAuthenticated, userController.playerProfile);
router.get('/company/profile/:id', secure.isAuthenticated, userController.companyProfile);

module.exports = router;