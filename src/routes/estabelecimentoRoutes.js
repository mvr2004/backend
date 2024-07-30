const express = require('express');
const router = express.Router();
const mainController = require('../controllers/estabelecimentoController');

// Eventos
router.get('/list', mainController.getAllEventos);
router.post('/create', mainController.createEvento);
router.put('/update/:id', mainController.updateEvento);
router.delete('/del/:id', mainController.deleteEvento);
router.get('/get/:id', mainController.getEvento);

// Avaliações
router.post('/avaliacoes', mainController.addOrUpdateRating);

module.exports = router;