// controllers/establishmentController.js

const Estabelecimento = require('../models/Estabelecimento');
const upload = require('../config/uploadConfig');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const estabelecimentoService = require('../services/estabelecimentoService');

// Função para criar um novo estabelecimento com upload de fotografia
const createEstablishment = async (req, res, next) => {
  try {
    const { nome, localizacao, contacto, descricao, pago, subareaId, centroId } = req.body;

    console.log('Dados recebidos:', req.body);

    // Verifica se os campos 'nome' e 'localizacao' estão presentes e não vazios
    if (!nome || !localizacao) {
      console.log('Erro: Nome ou localização não fornecidos');
      return res.status(400).json({ error: 'Nome e localização são obrigatórios.' });
    }

    // Verifica se já existe um estabelecimento com o mesmo nome e localização
    const existingEstablishment = await estabelecimentoService.checkExistingEstablishment(nome, localizacao);
    if (existingEstablishment) {
      return res.status(400).json({ error: 'Já existe um estabelecimento com este nome ou localização.' });
    }

    // Executa o middleware de upload de imagem
    upload.single('foto')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: 'Erro ao enviar a imagem.' });
      }

      try {
        // Verifica se foi enviada uma imagem
        if (!req.file) {
          return res.status(400).json({ error: 'É necessário enviar uma imagem.' });
        }

        // Redimensiona a imagem utilizando sharp
        const resizedImage = await sharp(req.file.path)
          .resize({ width: 300, height: 300 })
          .toBuffer();

        // Define o nome do arquivo e o caminho onde será salvo
        const filename = `${Date.now()}-${req.file.originalname}`;
        const filepath = path.join(__dirname, '../public/uploads/', filename);

        // Salva a imagem redimensionada no sistema de arquivos
        await sharp(resizedImage).toFile(filepath);
        console.log(`Imagem salva em ${filepath}`);

        // Remove o arquivo temporário enviado pelo cliente
        fs.unlink(req.file.path, (err) => {
          if (err) {
            console.error('Erro ao remover o arquivo temporário:', err);
          } else {
            console.log('Arquivo temporário removido com sucesso');
          }
        });

        // Cria o novo estabelecimento no banco de dados
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

        // Retorna o estabelecimento criado como resposta
        res.status(201).json({ establishment });
      } catch (imageError) {
        console.error('Erro ao processar a imagem:', imageError);
        return res.status(400).json({ error: 'Imagem inválida.' });
      }
    });
  } catch (error) {
    console.error('Erro ao criar o estabelecimento:', error);
    next(error); // Passa o erro para o próximo middleware de tratamento de erro
  }
};

// Controlador para buscar todos os estabelecimentos
const getAllEstablishments = async (req, res, next) => {
  try {
    const establishments = await establishmentService.getAllEstablishments();
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
    const establishments = await establishmentService.getEstablishmentsByName(nome);
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

    const establishments = await establishmentService.getEstablishmentsByAreasAndCentro(areaIdsArray, centroId);
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
    const establishment = await establishmentService.getEstablishmentById(id);
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
