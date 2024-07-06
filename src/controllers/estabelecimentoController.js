const bcrypt = require('bcrypt');
const path = require('path');
const sharp = require('sharp');
const multer = require('multer');
const fs = require('fs');
const User = require('../models/User');                                                              
const Centro = require('../models/Centro');
const Estabelecimento = require('../models/Estabelecimento');
const Subarea = require('../models/Subarea'); 
const upload = require('../config/uploadConfig'); 

const establishmentService = require('../services/EstabelecimentoService');

// Controlador para criar um novo estabelecimento
const createEstablishment = async (req, res, next) => {
  try {
    await establishmentService.createEstablishment(req, res, next);
  } catch (error) {
    console.error('Erro no controlador de estabelecimento:', error);
    next(error);
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

// Controlador para buscar estabelecimentos por uma ou várias áreas de interesse
const getEstablishmentsBySubareas = async (req, res, next) => {
  const { subareaIds } = req.query;
  try {
    const establishments = await establishmentService.getEstablishmentsBySubareas(subareaIds);
    res.json({ establishments });
  } catch (error) {
    console.error('Erro ao buscar estabelecimentos por áreas de interesse:', error);
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
  getAllEstablishments,
  getEstablishmentsBySubareas,
  getEstablishmentById,
};