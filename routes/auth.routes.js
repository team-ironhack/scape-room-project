const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');


router.get('/register-player', authController.registerPlayer);
router.get('/register-company', authController.registerCompany);
router.get('/login', authController.login);

module.exports = router;
