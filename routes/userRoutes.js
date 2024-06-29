// src/routes/userRoutes.js
const express = require('express');
const { register, getData } = require('../controllers/userController');
const router = express.Router();

router.post('/register', register);
router.get('/data', getData);

module.exports = router;
