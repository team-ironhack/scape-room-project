const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const upload = require('../config/multer.config');


router.get('/register-player', authController.registerPlayer);
router.post('/register-player', upload.single('avatar'), authController.doRegisterPlayer);
router.get('/register-company', authController.registerCompany);
router.post('/register-company', upload.single('avatar'), authController.doRegisterCompany);

router.get('/player/:id/activate', authController.activatePlayer);
router.get('/company/:id/activate', authController.activateCompany)

router.get('/login', authController.login);
router.post('/login', authController.doLogin);

router.get('/login/google', authController.loginGoogle);
router.get('/authenticate/google/cb', authController.doLoginGoogle);

router.get('/logout', authController.logout);

module.exports = router;
