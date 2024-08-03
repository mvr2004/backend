const Formulario = require('../models/Formulario');
const CampoFormulario = require('../models/CampoFormulario');
const RespostaFormulario = require('../models/RespostaFormulario');
const Utilizador = require('../models/Utilizador');

// Criar formulário
exports.createFormulario = async (req, res) => {
    try {
        const { nome, eventoId } = req.body;
        const formulario = await Formulario.create({ nome, eventoId });
        res.status(201).json(formulario);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar formulário' });
    }
};

// Atualizar estado do formulário
exports.updateFormularioStatus = async (req, res) => {
    try {
        const { formularioId } = req.params;
        const { ativo } = req.body;
        const formulario = await Formulario.findByPk(formularioId);
        if (formulario) {
            formulario.ativo = ativo;
            await formulario.save();
            res.json({ message: 'Estado do formulário atualizado com sucesso' });
        } else {
            res.status(404).json({ error: 'Formulário não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar estado do formulário' });
    }
};

// Criar campo do formulário
exports.createCampoFormulario = async (req, res) => {
    try {
        const { formularioId } = req.params;
        const { nome, tipo, opcoes } = req.body;
        const campoFormulario = await CampoFormulario.create({ nome, tipo, opcoes, formularioId });
        res.status(201).json(campoFormulario);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao adicionar campo ao formulário' });
    }
};

// Submeter resposta ao formulário
exports.submitFormularioResponse = async (req, res) => {
    try {
        const { utilizadorId, respostas } = req.body; // respostas: [{ campoFormularioId: 1, resposta: 'resposta' }, ...]
        const responses = respostas.map(r => ({
            resposta: r.resposta,
            campoFormularioId: r.campoFormularioId,
            utilizadorId
        }));
        await RespostaFormulario.bulkCreate(responses);
        res.status(201).json({ message: 'Respostas submetidas com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao submeter respostas' });
    }
};

// Obter respostas por formulário
exports.getResponsesByFormulario = async (req, res) => {
    try {
        const { formularioId } = req.params;
        const campos = await CampoFormulario.findAll({
            where: { formularioId },
            include: {
                model: RespostaFormulario,
                include: [Utilizador]
            }
        });
        res.json(campos);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao obter respostas' });
    }
};
