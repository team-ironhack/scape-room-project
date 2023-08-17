const express = require('express');
const router = express.Router();
const roomController = require('../controllers/room.controller');

router.get('/room/:id', roomController.roomDetail);

module.exports = router;