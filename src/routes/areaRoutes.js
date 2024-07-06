const express = require('express');
const areaController = require('../controllers/areaController');
const router = express.Router();

// Rota para buscar todas as áreas
router.get('/areas', areaController.getAllAreas);

// Rota para buscar as subáreas de uma área específica
router.get('/areas/:areaId/subareas', areaController.getSubareasByAreaId);

module.exports = router;
