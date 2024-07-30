const Evento = require('../models/Evento');
const ParticipacaoEvento = require('../models/UserEventos');
const { Sequelize } = require('sequelize');

// Ver todos os eventos com a contagem de participantes
exports.getAllEventos = async (req, res) => {
    const { centro } = req.query;

    const whereCondition = centro ? { centroId: centro } : {};

    try {
        const eventos = await Evento.findAll({
            where: whereCondition
        });
        res.json(eventos);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar eventos', details: error.message });
    }
};

// Ver eventos por centro
exports.getEventosByCentro = async (req, res) => {
    const { centroId } = req.params;

    try {
        const eventos = await Evento.findAll({
            where: { centroId }
        });
        res.json(eventos);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar eventos', details: error.message });
    }
};



// Inserir um novo evento
exports.createEvento = async (req, res) => {
    const { nome, localizacao, data, hora, descricao, subareaId, utilizadorId, centroId } = req.body;
    try {
        const evento = await Evento.create({ nome, localizacao, data, hora, descricao, subareaId, utilizadorId, centroId });
        res.status(201).json(evento);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar evento' });
    }
};

// Editar um evento existente
exports.updateEvento = async (req, res) => {
    const { id } = req.params;
    const { nome, localizacao, data, hora, descricao, subareaId, utilizadorId, centroId, ativo } = req.body;
    try {
        const evento = await Evento.findByPk(id);
        if (!evento) {
            return res.status(404).json({ error: 'Evento não encontrado' });
        }
        evento.nome = nome;
        evento.localizacao = localizacao;
        evento.data = data;
        evento.hora = hora;
        evento.descricao = descricao;
        evento.subareaId = subareaId;
        evento.utilizadorId = utilizadorId;
        evento.centroId = centroId;
        evento.ativo = ativo;
        await evento.save();
        res.json(evento);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar evento' });
    }
};

// Apagar um evento
exports.deleteEvento = async (req, res) => {
    const { id } = req.params;
    try {
        const evento = await Evento.findByPk(id);
        if (!evento) {
            return res.status(404).json({ error: 'Evento não encontrado' });
        }
        await evento.destroy();
        res.json({ message: 'Evento apagado com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao apagar evento' });
    }
};

// Tornar eventos inativos após a data do evento
exports.updateEventosStatus = async () => {
    try {
        const eventos = await Evento.findAll();
        const currentDate = new Date();
        for (let evento of eventos) {
            if (new Date(evento.data) < currentDate && evento.ativo) {
                evento.ativo = false;
                await evento.save();
            }
        }
    } catch (error) {
        console.error('Erro ao atualizar status dos eventos:', error);
    }
};
