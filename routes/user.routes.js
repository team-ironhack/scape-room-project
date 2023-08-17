const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller')
const secure = require('../middlewares/auth.middleware')
const role = require('../middlewares/role.middleware')
const upload = require('../config/multer.config');


router.get('/player/profile/:id', secure.isAuthenticated, userController.playerProfile);
router.get('/company/profile/:id', secure.isAuthenticated, userController.companyProfile);
router.get('/company/:id', secure.isAuthenticated, userController.companyDetail);
router.get('/player/:id', secure.isAuthenticated, userController.playerDetail);
router.get('/create/room', secure.isAuthenticated, role.isCompany, userController.createRoom);
router.post('/create/room', secure.isAuthenticated, role.isCompany, upload.single('image'), userController.doCreateRoom)

module.exports = router;