const express = require("express");
const router = express.Router();
const authController = require("../controller/authController.js");

// POST /auth/login
router.post("/login", authController.loginUser);

module.exports = router;
