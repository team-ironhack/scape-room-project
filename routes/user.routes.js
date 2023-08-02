const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller')


router.get('/player/profile', userController.playerProfile);
router.get('/company/profile', userController.companyProfile);

module.exports = router;