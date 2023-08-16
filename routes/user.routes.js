const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller')
const secure = require('../middlewares/auth.middleware')
const role = require('../middlewares/role.middleware')


router.get('/player/profile/:id', secure.isAuthenticated, role.isPlayer, userController.playerProfile);
router.get('/company/profile/:id', secure.isAuthenticated, role.isCompany, userController.companyProfile);
router.get('/create/room', secure.isAuthenticated, role.isCompany, userController.createRoom)

module.exports = router;