// src/routes/estabelecimentoRoutes.js
const express = require('express');
const estabelecimentoController = require('../controllers/estabelecimentoController'); 
const avaliacaoEstabelecimentoController = require('../controllers/avaliacaoEstabelecimentoController');
const router = express.Router();
const upload = require('../config/uploadConfig');


// Rota para criar um estabelecimento
router.post('/criarestab', upload.single('foto'), estabelecimentoController.createEstablishment);

// Rota para buscar todos os estabelecimentos
router.get('/list', estabelecimentoController.getAllEstablishments);

// Rota para buscar o estabelecimento pelo nome
router.get('/estabname', estabelecimentoController.getEstablishmentsByName);

// Rota para buscar estabelecimentos por uma ou várias áreas de interesse
router.get('/estabareaecemtrp', estabelecimentoController.getEstablishmentsByAreasAndCentro);


// Rota para buscar um estabelecimento pelo ID
router.get('/estab/:id', estabelecimentoController.getEstablishmentById);


// Rota para criar uma avaliação de estabelecimento
router.post('/avaliacao', avaliacaoEstabelecimentoController.createEstabelecimentoReview);

// Rota para listar as avaliações de um estabelecimento
router.get('/avaliacao/:estabelecimentoId', avaliacaoEstabelecimentoController.listEstabelecimentoReviews);

// Rota para calcular a média das avaliações de um estabelecimento
router.get('/avaliacao/media/:estabelecimentoId', avaliacaoEstabelecimentoController.calculateEstabelecimentoAverageRating);

app.get('/test/establishment/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const estabelecimento = await Estabelecimento.findByPk(id);
    if (!estabelecimento) {
      return res.status(404).json({ error: 'Estabelecimento não encontrado.' });
    }
    res.json({ estabelecimento });
  } catch (error) {
    console.error('Erro ao buscar estabelecimento por ID:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});




module.exports = router;
