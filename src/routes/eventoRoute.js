// routes/eventRoutes.js

const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventoController');

router.post('/create', eventController.createEvent);
router.get('/', eventController.getAllEvents);
router.get('/searchByAreasAndCentro', eventController.getEventsByAreasAndCentro);
router.get('/:id', eventController.getEventById);

module.exports = router;
