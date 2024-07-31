// controllers/establishmentController.js

const Estabelecimento = require('../models/Estabelecimento');
const upload = require('../configs/multer');
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

    // Formata a resposta para incluir a média das avaliações
    const response = establishments.map(establishment => {
      return {
        id: establishment.id,
        nome: establishment.nome,
        localizacao: establishment.localizacao,
        contacto: establishment.contacto,
        descricao: establishment.descricao,
        pago: establishment.pago,
        foto: establishment.foto,
        subareaId: establishment.subareaId,
        centroId: establishment.centroId,
        Subarea: establishment.Subarea,
        Centro: establishment.Centro,
        averageRating: parseFloat(establishment.averageRating) || 0 // Adiciona a média das avaliações
      };
    });

    res.json({ establishments: response });
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

module.exports = {
  createEstablishment,
  getAllEstablishments,
  getEstablishmentsByName,
  getEstablishmentsByAreasAndCentro,
  getEstablishmentById,
};
