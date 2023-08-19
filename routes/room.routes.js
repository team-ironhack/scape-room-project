const express = require('express');
const router = express.Router();
const roomController = require('../controllers/room.controller');
const secure = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');
const upload = require('../config/multer.config');

router.get('/room/:id', roomController.roomDetail);
router.get('/create/room', secure.isAuthenticated, role.isCompany, roomController.createRoom);
router.post('/create/room', secure.isAuthenticated, role.isCompany, upload.single('image'), roomController.doCreateRoom);
router.get('/edit/room/:id', secure.isAuthenticated, role.isCompany, roomController.editRoom);
router.post('/edit/room/:id', secure.isAuthenticated, role.isCompany, upload.single('image'), roomController.doEditRoom);
router.post('/delete/room/:id', secure.isAuthenticated, role.isCompany, roomController.deleteRoom);

module.exports = router;