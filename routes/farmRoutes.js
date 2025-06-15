const express = require('express');
const farmControl = require('../controller/farmController');

const router = express.Router();

router.get("/maps", farmControl.funcExibirMapa);
router.get("/farms", farmControl.funcGetFarms);
router.get("/farm/:id", farmControl.funcGetAFarm);
router.post("/createFarm", farmControl.funcPostFarm);
router.delete("/farm/:id", farmControl.funcDelFarm);

module.exports = router;