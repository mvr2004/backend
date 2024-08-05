// routes/centroRoutes.js
const express = require('express');
const router = express.Router();
const { listarCentros } = require('../controllers/centroController');

router.get('/', listarCentros);

module.exports = router;
