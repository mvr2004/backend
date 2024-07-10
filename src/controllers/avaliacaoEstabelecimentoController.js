// src/controllers/avaliacaoEstabelecimentoController.js
const { sequelize } = require('../config/dbConfig'); // Certifique-se de que o caminho está correto
const User = require('../models/User');
const Estabelecimento = require('../models/Estabelecimento');
const AvEstabelecimento = require('../models/AvaliacaoEstabelecimento');

// Controlador para criar uma nova avaliação de estabelecimento
const createEstabelecimentoReview = async (req, res, next) => {
  try {
    const { userId, establishmentId, rating } = req.body;

    // Verifica se o usuário e o estabelecimento existem
    const user = await User.findByPk(userId);
    if (!user) {
      console.log('Usuário não encontrado com id:', userId);
      return res.status(404).json({ error: 'Utilizador não encontrado.' });
    }

    const estabelecimento = await Estabelecimento.findByPk(establishmentId);
    if (!estabelecimento) {
      console.log('Estabelecimento não encontrado com id:', establishmentId);
      return res.status(404).json({ error: 'Estabelecimento não encontrado.' });
    }

    // Cria a avaliação de estabelecimento
    const review = await AvEstabelecimento.create({
      userId,
      establishmentId,
      rating
    });

    res.status(201).json({ review });
  } catch (error) {
    console.error('Erro ao criar avaliação de estabelecimento:', error);
    next(error);
  }
};

// Controlador para listar as avaliações de um estabelecimento
const listEstabelecimentoReviews = async (req, res, next) => {
  const { establishmentId } = req.params;
  try {
    console.log('Listing reviews for establishment:', establishmentId);

    // Busca todas as avaliações para o estabelecimento específico
    const reviews = await AvEstabelecimento.findAll({
      where: { establishmentId },
      include: [{ model: User, attributes: ['id', 'name'] }] // Inclui o nome do usuário na resposta
    });

    console.log('Found reviews:', reviews);

    if (!reviews || reviews.length === 0) {
      return res.status(404).json({ error: 'Nenhuma avaliação encontrada para este estabelecimento.' });
    }

    res.json({ reviews });
  } catch (error) {
    console.error('Erro ao buscar avaliações de estabelecimento:', error);
    next(error);
  }
};

const calculateEstabelecimentoAverageRating = async (req, res, next) => {
  const { establishmentId } = req.params;
  try {
    console.log('Calculating average rating for establishment:', establishmentId);

    const averageRating = await AvEstabelecimento.findAll({
      where: { establishmentId },
      attributes: [[sequelize.fn('AVG', sequelize.col('rating')), 'averageRating']],
      raw: true
    });

    console.log('Calculated average rating:', averageRating);

    if (!averageRating || averageRating.length === 0) {
      return res.status(404).json({ error: 'Nenhuma avaliação encontrada para este estabelecimento.' });
    }

    res.json({ averageRating: averageRating[0].averageRating });
  } catch (error) {
    console.error('Erro ao calcular média das avaliações de estabelecimento:', error);
    next(error);
  }
};

module.exports = {
  createEstabelecimentoReview,
  listEstabelecimentoReviews, 
  calculateEstabelecimentoAverageRating,
};
