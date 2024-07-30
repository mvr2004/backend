const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/list', adminController.listAdmins);
router.post('/login', adminController.login);
router.post('/registar', adminController.createAdmin);
router.put('/update/:id', adminController.updatePassword);


module.exports = router;
