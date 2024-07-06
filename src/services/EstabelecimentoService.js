// services/establishmentService.js

const { Estabelecimento, Subarea } = require('../models');
const upload = require('../config/uploadConfig');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Função para verificar se já existe um estabelecimento com o mesmo nome ou localização
const checkExistingEstablishment = async (nome, localizacao) => {
  const existingEstablishment = await Estabelecimento.findOne({
    where: {
      nome,
      localizacao
    }
  });
  return existingEstablishment;
};

// Função para criar um novo estabelecimento com upload de fotografia
const createEstablishment = async (req, res, next) => {
  try {
    const { nome, localizacao, contacto, descricao, pago, subareaId } = req.body;

    // Verifica se já existe um estabelecimento com o mesmo nome ou localização
    const existingEstablishment = await checkExistingEstablishment(nome, localizacao);
    if (existingEstablishment) {
      return res.status(400).json({ error: 'Já existe um estabelecimento com este nome ou localização.' });
    }

    // Configuração do upload de fotografia utilizando multer e sharp
    upload.single('foto')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: 'Erro ao enviar a imagem.' });
      }

      try {
        if (!req.file) {
          return res.status(400).json({ error: 'É necessário enviar uma imagem.' });
        }

        // Processamento da imagem com sharp
        const resizedImage = await sharp(req.file.path)
          .resize({ width: 300, height: 300 })
          .toBuffer();

        const filename = `${Date.now()}-${req.file.originalname}`;
        const filepath = path.join(__dirname, '../public/uploads/', filename);

        // Salva a imagem redimensionada
        await sharp(resizedImage).toFile(filepath);
        console.log(`Imagem salva em ${filepath}`);

        // Remove o arquivo temporário
        fs.unlink(req.file.path, (err) => {
          if (err) {
            console.error('Erro ao remover o arquivo temporário:', err);
          } else {
            console.log('Arquivo temporário removido com sucesso');
          }
        });

        // Cria o estabelecimento no banco de dados
        const establishment = await Estabelecimento.create({
          nome,
          localizacao,
          contacto,
          descricao,
          pago,
          foto: `https://backend-9hij.onrender.com/uploads/${filename}`, // URL pública da imagem
          subareaId
        });

        res.status(201).json({ establishment });
      } catch (imageError) {
        console.error('Erro ao processar a imagem:', imageError);
        return res.status(400).json({ error: 'Imagem inválida.' });
      }
    });
  } catch (error) {
    console.error('Erro ao criar o estabelecimento:', error);
    next(error);
  }
};

// Função para buscar todos os estabelecimentos
const getAllEstablishments = async () => {
  const establishments = await Estabelecimento.findAll({
    include: [{
      model: Subarea,
      attributes: ['id', 'nome'],
    }],
  });
  return establishments;
};

// Função para buscar estabelecimentos por uma ou várias áreas de interesse
const getEstablishmentsBySubareas = async (subareaIds) => {
  const establishments = await Estabelecimento.findAll({
    where: {
      subareaId: subareaIds
    },
    include: [{
      model: Subarea,
      attributes: ['id', 'nome'],
    }],
  });
  return establishments;
};

// Função para buscar um estabelecimento pelo ID
const getEstablishmentById = async (id) => {
  const establishment = await Estabelecimento.findByPk(id, {
    include: [{
      model: Subarea,
      attributes: ['id', 'nome'],
    }],
  });
  return establishment;
};


module.exports = {
  createEstablishment,
   getAllEstablishments,
  getEstablishmentsBySubareas,
  getEstablishmentById,
};
