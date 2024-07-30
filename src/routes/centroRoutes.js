const express = require('express');
const router = express.Router();
const centroController = require('../controllers/centroController');

router.get('/list', centroController.listCentros);
router.post('/create', centroController.createCentro);
router.put('/update/:id', centroController.updateCentro);
router.delete('/delete/:id', centroController.deleteCentro);
router.get('/count', centroController.countCentros);

module.exports = router;
