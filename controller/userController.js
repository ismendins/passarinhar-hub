const userServ = require('../services/userService');

exports.funcGetUsers = userServ.getAllUsers;

exports.funcGetAUser = userServ.getOneUser;

exports.funcPostUsers = userServ.postNewUser;

exports.funcDelUsers = userServ.deleteUser;