// src/routes/estabelecimentoRoutes.js
const express = require('express');
const userController = require('../controllers/estabelecimentoController'); // Importando o userController
const avaliacaoEstabelecimentoController = require('../controllers/avaliacaoEstabelecimentoController');
const router = express.Router();const upload = require('../config/uploadConfig');


router.post('/criarestab', establishmentController.createEstablishment);

// Rota para buscar todos os estabelecimentos
router.get('/allestab', establishmentController.getAllEstablishments);

// Rota para buscar estabelecimentos por uma ou várias áreas de interesse
router.get('/estabelecimentos/por-area', establishmentController.getEstablishmentsBySubareas);

// Rota para buscar um estabelecimento pelo ID
router.get('/estabelecimentos/:id', establishmentController.getEstablishmentById);


// Rota para criar uma avaliação de estabelecimento
router.post('/avaliacao', avaliacaoEstabelecimentoController.createEstabelecimentoReview);

// Rota para listar as avaliações de um estabelecimento
router.get('/avaliacao/:estabelecimentoId', avaliacaoEstabelecimentoController.listEstabelecimentoReviews);

// Rota para calcular a média das avaliações de um estabelecimento
router.get('/avaliacao/media/:estabelecimentoId', avaliacaoEstabelecimentoController.calculateEstabelecimentoAverageRating);



module.exports = router;
