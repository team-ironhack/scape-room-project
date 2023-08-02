const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');


router.get('/register-player', authController.registerPlayer);
router.post('/register-player', authController.doRegisterPlayer);
router.get('/register-company', authController.registerCompany);
router.post('/register-company', authController.doRegisterCompany);

router.get('/player/:id/activate', authController.activatePlayer);
router.get('/company/:id/activate', authController.activateCompany)

router.get('/login', authController.login);
//router.post('/login', authController.doLogin);

module.exports = router;
