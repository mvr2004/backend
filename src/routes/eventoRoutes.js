// routes/eventoRoutes.js

const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventoController');

router.post('/create', eventController.createEvent);
router.get('/list', eventController.getAllEvents);
router.get('/searchByCentro', eventController.getEventsByCentro);
router.get('/:id', eventController.getEventById);

module.exports = router;
