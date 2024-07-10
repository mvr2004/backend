// controllers/establishmentController.js

const AvEstabelecimento = require('../models/AvaliacaoEstabelecimento');
const Estabelecimento = require('../models/Estabelecimento');
const upload = require('../config/uploadConfig');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const estabelecimentoService = require('../services/estabelecimentoService');

const createEstablishment = async (req, res, next) => {
  try {
    const { nome, localizacao, contacto, descricao, pago, subareaId, centroId } = req.body;

    // Verificação de campos obrigatórios
    if (!nome || !localizacao) {
      return res.status(400).json({ error: 'Nome e localização são obrigatórios.' });
    }

    // Verificação de estabelecimento existente
    const existingEstablishment = await estabelecimentoService.checkExistingEstablishment(nome, localizacao);
    if (existingEstablishment) {
      return res.status(400).json({ error: 'Já existe um estabelecimento com este nome ou localização.' });
    }

    // Middleware de upload de imagem
    if (req.file) {
      try {
        console.log('Recebido arquivo:', req.file);
        console.log('Caminho do arquivo:', req.file.path);

        // Processamento da imagem
        const resizedImage = await sharp(req.file.path)
          .resize({ width: 300, height: 300 })
          .toBuffer();

        const filename = `${Date.now()}-${req.file.originalname}`;
        const filepath = path.join(__dirname, '../public/uploads/', filename);

        // Salvando a imagem redimensionada no sistema de arquivos
        await sharp(resizedImage).toFile(filepath);
        console.log(`Imagem salva em ${filepath}`);

        // Removendo o arquivo temporário enviado pelo cliente
        fs.unlink(req.file.path, (err) => {
          if (err) {
            console.error('Erro ao remover o arquivo temporário:', err);
          } else {
            console.log('Arquivo temporário removido com sucesso');
          }
        });

        // URL da imagem para salvar no banco de dados
        const fotoUrl = `https://backend-9hij.onrender.com/uploads/${filename}`;

        // Criação do estabelecimento no banco de dados
        const establishment = await Estabelecimento.create({
          nome,
          localizacao,
          contacto,
          descricao,
          pago,
          foto: fotoUrl,
          subareaId,
          centroId
        });

        // Retorna o estabelecimento criado como resposta
        res.status(201).json({ establishment });
      } catch (error) {
        console.error('Erro ao processar a imagem:', error);
        return res.status(400).json({ error: 'Erro ao processar a imagem.' });
      }
    } else {
      // Se não houver arquivo, cria o estabelecimento sem imagem
      const establishment = await Estabelecimento.create({
        nome,
        localizacao,
        contacto,
        descricao,
        pago,
        subareaId,
        centroId
      });

      // Retorna o estabelecimento criado como resposta
      res.status(201).json({ establishment });
    }

  } catch (error) {
    console.error('Erro ao criar o estabelecimento:', error);
    next(error); // Passa o erro para o próximo middleware de tratamento de erro
  }
};


// Controlador para buscar todos os estabelecimentos
const getAllEstablishments = async (req, res, next) => {
  try {
    const establishments = await estabelecimentoService.getAllEstablishments();
    res.json({ establishments });
  } catch (error) {
    console.error('Erro ao buscar todos os estabelecimentos:', error);
    next(error);
  }
};

// Controlador para buscar estabelecimentos por nome
const getEstablishmentsByName = async (req, res, next) => {
  const { nome } = req.query;
  try {
    const establishments = await estabelecimentoService.getEstablishmentsByName(nome);
    res.json({ establishments });
  } catch (error) {
    console.error('Erro ao buscar estabelecimentos por nome:', error);
    next(error);
  }
};

const getEstablishmentsByAreasAndCentro = async (req, res, next) => {
  const { areaIds, centroId } = req.query;

  try {
    // Verifica se areaIds foi fornecido e é uma string não vazia
    if (!areaIds || typeof areaIds !== 'string' || areaIds.trim() === '') {
      throw new Error('IDs de área não fornecidos ou inválidos');
    }

    // Converte areaIds para um array de números inteiros
    const areaIdsArray = areaIds.split(',').map(id => parseInt(id.trim(), 10));

    // Valida se todos os elementos de areaIdsArray são números inteiros válidos
    if (areaIdsArray.some(isNaN)) {
      throw new Error('IDs de área inválidos');
    }

    const establishments = await estabelecimentoService.getEstablishmentsByAreasAndCentro(areaIdsArray, centroId);
    res.json({ establishments });
  } catch (error) {
    console.error('Erro ao buscar estabelecimentos por áreas de interesse e centro:', error.message);
    next(error);
  }
};



// Controlador para buscar um estabelecimento pelo ID
const getEstablishmentById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const establishment = await estabelecimentoService.getEstablishmentById(id);
    if (!establishment) {
      return res.status(404).json({ error: 'Estabelecimento não encontrado.' });
    }
    res.json({ establishment });
  } catch (error) {
    console.error('Erro ao buscar estabelecimento por ID:', error);
    next(error);
  }
};

// controllers/avaliacaoEstabelecimentoController.js
const createEstabelecimentoReview = async (req, res, next) => {
  const { establishmentId, userId, rating } = req.body;

  console.log('Creating review for establishmentId:', establishmentId); // Add this line

  try {
    const estabelecimento = await Estabelecimento.findByPk(establishmentId);

    if (!estabelecimento) {
      console.log('Establishment not found with ID:', establishmentId); // Add this line
      return res.status(404).json({ error: 'Estabelecimento não encontrado.' });
    }

    const review = await AvEstabelecimento.create({
      establishmentId,
      userId,
      rating,
    });

    res.status(201).json({ review });
  } catch (error) {
    console.error('Erro ao criar avaliação de estabelecimento:', error);
    next(error);
  }
};



// Controlador para listar as avaliações de um estabelecimento
const listEstabelecimentoReviews = async (req, res, next) => {
  const { estabelecimentoId } = req.params;

  try {
    const reviews = await AvEstabelecimento.findAll({
      where: { establishmentId: estabelecimentoId },
    });

    res.json({ reviews });
  } catch (error) {
    console.error('Erro ao listar avaliações de estabelecimento:', error);
    next(error);
  }
};

// Controlador para calcular a média das avaliações de um estabelecimento
const calculateEstabelecimentoAverageRating = async (req, res, next) => {
  const { estabelecimentoId } = req.params;

  try {
    const averageRating = await AvEstabelecimento.findOne({
      attributes: [[sequelize.fn('avg', sequelize.col('rating')), 'avgRating']],
      where: { establishmentId: estabelecimentoId },
    });

    res.json({ averageRating });
  } catch (error) {
    console.error('Erro ao calcular média das avaliações de estabelecimento:', error);
    next(error);
  }
};

module.exports = {
  createEstablishment,
  getAllEstablishments,
  getEstablishmentsByName,
  getEstablishmentsByAreasAndCentro,
  getEstablishmentById,
   createEstabelecimentoReview,
};
