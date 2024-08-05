// controllers/centroController.js
const Centro = require('../models/Centro');

const listarCentros = async (req, res) => {
    try {
        const centros = await Centro.findAll();
        res.json(centros);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar centros', error });
    }
};

module.exports = {
    listarCentros
};
