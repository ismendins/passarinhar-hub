const express = require('express');
const mapControl = require('../controller/mapController');

const router = express.Router();

router.get('/map', mapControl.funcShowMap);

module.exports = router;
