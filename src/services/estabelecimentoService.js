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


    const existingEstablishment = await checkExistingEstablishment(nome, localizacao);
    if (existingEstablishment) {
      return res.status(400).json({ error: 'Já existe um estabelecimento com este nome ou localização.' });
    }

    upload.single('foto')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: 'Erro ao enviar a imagem.' });
      }

      try {
        if (!req.file) {
          return res.status(400).json({ error: 'É necessário enviar uma imagem.' });
        }

        const resizedImage = await sharp(req.file.path)
          .resize({ width: 300, height: 300 })
          .toBuffer();

        const filename = `${Date.now()}-${req.file.originalname}`;
        const filepath = path.join(__dirname, '../public/uploads/', filename);

        await sharp(resizedImage).toFile(filepath);
        console.log(`Imagem salva em ${filepath}`);

        fs.unlink(req.file.path, (err) => {
          if (err) {
            console.error('Erro ao remover o arquivo temporário:', err);
          } else {
            console.log('Arquivo temporário removido com sucesso');
          }
        });

        const establishment = await Estabelecimento.create({
          nome,
          localizacao,
          contacto,
          descricao,
          pago,
          foto: `https://backend-9hij.onrender.com/uploads/${filename}`,
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


const getEstablishmentsByAreasAndCentro = async (areaIdsArray, centroId) => {
  try {
    // Encontra as subáreas que pertencem às áreas de interesse fornecidas
    const subareas = await Subarea.findAll({
      where: {
        areaId: areaIdsArray
      }
    });

    // Extrai os IDs das subáreas encontradas
    const subareaIds = subareas.map(subarea => subarea.id);

    // Constrói a cláusula where para a consulta de estabelecimentos
    const whereClause = {
      subareaId: subareaIds
    };

    // Adiciona filtro por centroId, se fornecido
    if (centroId) {
      whereClause.centroId = centroId;
    }

    // Consulta os estabelecimentos
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
    // Captura e relança o erro com uma mensagem específica
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
