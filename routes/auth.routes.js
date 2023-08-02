const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');


router.get('/register-player', authController.registerPlayer);
router.post('/register-player', authController.doRegisterPlayer);
router.get('/register-company', authController.registerCompany);
router.post('/register-company', authController.doRegisterCompany);
router.get('/login', authController.login);

module.exports = router;
