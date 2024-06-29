// src/routes/userRoutes.js
const express = require('express');
const userController = require('../controllers/userController'); // Importando o userController
const router = express.Router();

router.post('/register', userController.register); // Usando userController.register
router.get('/data', userController.getData); // Usando userController.getData
router.post('/confirmEmail', userController.confirmEmail); // Usando userController.confirmEmail

module.exports = router;
