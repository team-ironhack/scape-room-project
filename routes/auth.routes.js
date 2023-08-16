const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const upload = require('../config/multer.config');
const secure = require('../middlewares/auth.middleware')


router.get('/register-player', secure.isNotAuthenticated, authController.registerPlayer);
router.post('/register-player', secure.isNotAuthenticated, upload.single('avatar'), authController.doRegisterPlayer);
router.get('/register-company', secure.isNotAuthenticated, authController.registerCompany);
router.post('/register-company', secure.isNotAuthenticated, upload.single('avatar'), authController.doRegisterCompany);

router.get('/player/:id/activate', authController.activatePlayer);
router.get('/company/:id/activate', authController.activateCompany)

router.get('/login', secure.isNotAuthenticated, authController.login);
router.post('/login', secure.isNotAuthenticated, authController.doLogin);

router.get('/login/google', authController.loginGoogle);
router.get('/authenticate/google/cb', authController.doLoginGoogle);

router.get('/logout', authController.logout);

module.exports = router;
