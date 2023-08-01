const express = require('express');
const router = express.Router();
const miscController = require('../controllers/misc.controller');

// HOME
router.get('/home', miscController.home);

module.exports = router;