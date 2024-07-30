const ParticipacaoEvento = require('../models/UserEventos');

// Adicionar um usuário a um evento
exports.addParticipacao = async (req, res) => {
    const { utilizadorId, eventoId } = req.body;
    try {
        const participacao = await ParticipacaoEvento.create({ utilizadorId, eventoId });
        res.status(201).json(participacao);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao adicionar participação' });
    }
};

// Remover um usuário de um evento
exports.removeParticipacao = async (req, res) => {
    const { utilizadorId, eventoId } = req.body;
    try {
        const participacao = await ParticipacaoEvento.findOne({ where: { utilizadorId, eventoId } });
        if (!participacao) {
            return res.status(404).json({ error: 'Participação não encontrada' });
        }
        await participacao.destroy();
        res.json({ message: 'Participação removida com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao remover participação' });
    }
};
