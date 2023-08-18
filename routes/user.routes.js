const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller')
const secure = require('../middlewares/auth.middleware')


router.get('/company/profile/:id', secure.isAuthenticated, userController.companyProfile);
router.get('/company/profile/edit/:id', secure.isAuthenticated, userController.editCompanyProfile);
router.post('/company/profile/edit/:id', secure.isAuthenticated, userController.doEditCompanyProfile);
router.get('/company/:id', secure.isAuthenticated, userController.companyDetail);

router.get('/player/profile/:id', secure.isAuthenticated, userController.playerProfile);
router.get('/player/profile/edit/:id', secure.isAuthenticated, userController.editPlayerProfile);
router.post('/player/profile/edit/:id', secure.isAuthenticated, userController.doEditPlayerProfile);
router.get('/player/:id', secure.isAuthenticated, userController.playerDetail);


module.exports = router;