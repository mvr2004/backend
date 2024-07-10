// services/establishmentService.js

const Estabelecimento = require('../models/Estabelecimento');
const Subarea = require('../models/Subarea');
const Area = require('../models/Area');
const Centro = require('../models/Centro');
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
    const { nome, localizacao, contacto, descricao, pago, subareaId, centroId } = req.body;

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
          subareaId,
          centroId
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
      attributes: ['id', 'nomeSubarea'],
    }, {
      model: Centro,
      attributes: ['id', 'centro'],
    }],
  });
  return establishments;
};

// Função para buscar estabelecimentos por nome
const getEstablishmentsByName = async (name) => {
  const establishments = await Estabelecimento.findAll({
    where: {
      nome: name
    },
    include: [{
      model: Subarea,
      attributes: ['id', 'nomeSubarea'],
    }, {
      model: Centro,
      attributes: ['id', 'centro'],
    }],
  });
  return establishments;
};

const getEstablishmentsByAreasAndCentro = async (areaIds, centroId) => {
  try {
    if (!areaIds) {
      throw new Error('IDs de área não fornecidos');
    }

    // Split areaIds if it's a string (comma-separated list)
    const areaIdsArray = typeof areaIds === 'string' ? areaIds.split(',').map(id => parseInt(id.trim())) : [areaIds];

    // Validate if areaIdsArray contains valid integers
    if (areaIdsArray.some(isNaN)) {
      throw new Error('IDs de área inválidos');
    }

    // Find subareas that belong to the provided areas of interest
    const subareas = await Subarea.findAll({
      where: {
        areaId: areaIdsArray
      }
    });

    // Extract IDs of the found subareas
    const subareaIds = subareas.map(subarea => subarea.id);

    // Build the where clause for the establishment query
    const whereClause = {
      subareaId: subareaIds
    };

    // Add filter by centroId, if provided
    if (centroId) {
      whereClause.centroId = centroId;
    }

    // Query establishments
    const establishments = await Estabelecimento.findAll({
      where: whereClause,
      include: [
        {
          model: Subarea,
          attributes: ['id', 'nomeSubarea'],
          include: {
            model: Area,
            attributes: ['id', 'nomeArea'],
          },
        },
        {
          model: Centro,
          attributes: ['id', 'centro'],
        },
      ],
    });

    return establishments;
  } catch (error) {
    throw new Error(`Erro ao buscar estabelecimentos por áreas de interesse e centro: ${error.message}`);
  }
};

// Função para buscar um estabelecimento pelo ID
const getEstablishmentById = async (id) => {
  const establishment = await Estabelecimento.findByPk(id, {
    include: [{
      model: Subarea,
      attributes: ['id', 'nomeSubarea'],
      include: {
        model: Area,
        attributes: ['id', 'nomeArea'],
      },
    }, {
      model: Centro,
      attributes: ['id', 'centro'],
    }],
  });
  return establishment;
};

module.exports = {
  createEstablishment,
  getAllEstablishments,
  getEstablishmentsByName,
  getEstablishmentsByAreasAndCentro,
  getEstablishmentById,
};
