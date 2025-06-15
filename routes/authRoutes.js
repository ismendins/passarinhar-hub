const express = require('express');
const authControl = require('../controller/authController');

const router = express.Router();

// Rota para login
router.post('/login', authControl.funcLogin);

// Rota para registro
router.post('/register', authControl.funcRegister);

// Rota para logout
router.post('/logout', authControl.funcLogout);

module.exports = router;
