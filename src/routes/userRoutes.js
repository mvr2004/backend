// src/routes/userRoutes.js
const express = require('express');
const userController = require('../controllers/userController'); // Importando o userController
const router = express.Router();
const upload = require('../config/uploadConfig');


router.post('/register', userController.register); // Usando userController.register
router.get('/data', userController.getData); // Usando userController.getData
router.post('/confirmEmail', userController.confirmEmail); // Usando userController.confirmEmail
router.post('/updatePassword', userController.updatePassword);  
router.post('/updateCentro', userController.updateCentro);
router.post('/forgotPassword', userController.forgotPassword); 
router.post('/resetPassword', userController.resetPassword); 
router.put('/updateProfile/:id', upload.single('photo'), userController.updateUserProfile);
router.get('/getUserData/:userId', userController.getUserData);
router.get('/areas/:userId', userController.getUserAreas); 
router.post('/updateUserAreas', userController.updateUserAreas);


module.exports = router;
