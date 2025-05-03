const express = require('express');
const userControl = require('../controller/userController');

const router = express.Router();

router.get("/users", userControl.funcGetUsers);
router.get("/user/:id", userControl.funcGetAUser);
router.post("/register", userControl.funcPostUsers);
router.delete("/user/:id", userControl.funcDelUsers);

module.exports = router;