const express = require('express');
const router = express.Router();
const areaController = require('../controllers/areaController');
const subareaController = require('../controllers/subareaController');
const userAreaController = require('../controllers/userAreaController');

// Rotas para Áreas
router.get('/list', areaController.listAreas);
router.post('/create', areaController.createArea);
router.put('/update/:id', areaController.updateArea);
router.delete('/del/:id', areaController.deleteArea);

// Rotas para Subáreas
router.get('/listsub', subareaController.listSubareas);
router.post('/createsub', subareaController.createSubarea);
router.put('/updatesub/:id', subareaController.updateSubarea);
router.delete('/delsub/:id', subareaController.deleteSubarea);
router.get('/count-subareas-and-areas', subareaController.countSubareasAndAreas); // Nova rota para contar subáreas e áreas



// Rota para adicionar área de interesse a um usuário
router.post('/add-user-area', userAreaController.addUserArea);

// Rota para listar áreas de interesse de um usuário
router.get('/list-user-areas/:userId', userAreaController.listUserAreas);

module.exports = router;
