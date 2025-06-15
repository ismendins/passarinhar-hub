const authServ = require('../services/authService');

exports.funcLogin = authServ.login;
exports.funcRegister = authServ.register;
exports.funcLogout = authServ.logout;
