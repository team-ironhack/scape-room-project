const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller')
const secure = require('../middlewares/auth.middleware')
const role = require('../middlewares/role.middleware')


router.get('/player/profile', secure.isAuthenticated, role.isPlayer, userController.playerProfile);
router.get('/company/profile', secure.isAuthenticated, role.isCompany, userController.companyProfile);

module.exports = router;