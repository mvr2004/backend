// src/routes/authRoutes.js
const express = require('express');
const { login, googleLogin } = require('../controllers/authController');
const router = express.Router();

router.post('/login', login);
router.post('/login/google', googleLogin);

module.exports = router;
