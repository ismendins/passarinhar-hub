const farmServ = require('../services/farmService');

exports.funcGetAllFarms = farmServ.getAllFarms;

exports.funcGetAFarm = farmServ.getOneFarm;

exports.funcPostFarm = farmServ.postNewFarm;

exports.funcDelFarm = farmServ.deleteFarm;

exports.funcGetAdd = farmServ.getAddressFromCoordinates;

exports.funcGetCoord = farmServ.getCoordinatesFromAddress;