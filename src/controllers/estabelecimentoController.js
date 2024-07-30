const Evento = require('../models/Evento');
const AvEstabelecimento = require('../models/AvaliacaoEstabelecimento');
const Estabelecimento = require('../models/Estabelecimento');
const sequelize = require('../configs/database');

// Eventos
exports.getAllEventos = async (req, res) => {
    try {
        const eventos = await Evento.findAll();
        res.json(eventos);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar eventos' });
    }
};

exports.createEvento = async (req, res) => {
    const { nome, localizacao, data, hora, descricao, subareaId, utilizadorId, centroId } = req.body;
    try {
        const evento = await Evento.create({ nome, localizacao, data, hora, descricao, subareaId, utilizadorId, centroId });
        res.status(201).json(evento);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar evento' });
    }
};

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

exports.getEvento = async (req, res) => {
    const { id } = req.params;
    try {
        const evento = await Evento.findByPk(id, {
            include: [
                {
                    model: Estabelecimento,
                    include: [
                        {
                            model: AvEstabelecimento,
                            attributes: []
                        }
                    ],
                    attributes: {
                        include: [
                            [sequelize.fn('AVG', sequelize.col('AvEstabelecimentos.rating')), 'averageRating'],
                            [sequelize.fn('COUNT', sequelize.col('AvEstabelecimentos.id')), 'ratingCount']
                        ]
                    }
                }
            ]
        });
        if (!evento) {
            return res.status(404).json({ error: 'Evento não encontrado' });
        }
        res.json(evento);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar evento' });
    }
};

// Avaliação de Estabelecimentos
exports.addOrUpdateRating = async (req, res) => {
    const { userId, estabelecimentoId, rating } = req.body;
    try {
        const existingRating = await AvEstabelecimento.findOne({ where: { userId, estabelecimentoId } });
        if (existingRating) {
            existingRating.rating = rating;
            await existingRating.save();
            res.json(existingRating);
        } else {
            const newRating = await AvEstabelecimento.create({ userId, estabelecimentoId, rating });
            res.status(201).json(newRating);
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao adicionar/atualizar avaliação' });
    }
};
