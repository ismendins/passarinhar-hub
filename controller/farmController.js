const farmServ = require('../services/farmService');

exports.funcGetFarms = farmServ.getAllFarms;

exports.funcGetAFarm = farmServ.getOneFarm;

exports.funcPostFarm = farmServ.postNewFarm;

exports.funcDelFarm = farmServ.deleteFarm;