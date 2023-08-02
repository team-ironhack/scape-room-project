const express = require('express');
const router = express.Router();
const miscController = require('../controllers/misc.controller');


// HOME
router.get('/', miscController.test);
router.get('/home', miscController.home);

module.exports = router;