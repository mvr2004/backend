// src/routes/userRoutes.js
const express = require('express');
const { register, getData, confirmEmail} = require('../controllers/userController');
const router = express.Router();

router.post('/register', register);
router.get('/data', getData);
router.post('/confirmEmail', userController.confirmEmail);

module.exports = router;
