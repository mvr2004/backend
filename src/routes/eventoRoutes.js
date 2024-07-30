const express = require('express');
const router = express.Router();
const eventoController = require('../controllers/eventoController');
const participacaoEventoController = require('../controllers/participacaoEventoController');

router.get('/list', eventoController.getAllEventos);
router.post('/criar', eventoController.createEvento);
router.put('/update/:id', eventoController.updateEvento);
router.delete('/del/:id', eventoController.deleteEvento);
router.get('/listByCentro/:centroId', eventoController.getEventosByCentro);

router.post('/addpart', participacaoEventoController.addParticipacao);
router.delete('/removepart', participacaoEventoController.removeParticipacao);

module.exports = router;
