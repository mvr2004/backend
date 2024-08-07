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

// Obter formulários respondidos por um utilizador
exports.getFormulariosRespondidos = async (req, res) => {
    try {
        const { utilizadorId } = req.params;
        const formulariosRespondidos = await RespostaFormulario.findAll({
            where: { utilizadorId },
            include: [{
                model: CampoFormulario,
                include: [Formulario]
            }]
        });
        const formularios = formulariosRespondidos.map(resposta => resposta.CampoFormulario.Formulario);
        res.json(formularios);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao obter formulários respondidos' });
    }
};

// Obter respostas de um formulário por utilizador e evento
exports.getFormularioResponsesByUserAndEvent = async (req, res) => {
    try {
        const { utilizadorId, eventoId, formularioId } = req.params;
        const campos = await CampoFormulario.findAll({
            where: { formularioId },
            include: {
                model: RespostaFormulario,
                where: { utilizadorId },
                include: [Utilizador]
            }
        });
        const formulario = await Formulario.findOne({ where: { id: formularioId, eventoId } });
        if (formulario) {
            res.json({ formulario, campos });
        } else {
            res.status(404).json({ error: 'Formulário não encontrado para este evento' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao obter respostas' });
    }
};

// Obter formulários respondidos de um evento por um utilizador
exports.getFormulariosRespondidosPorEvento = async (req, res) => {
    try {
        const { utilizadorId, eventoId } = req.params;
        const formulariosRespondidos = await RespostaFormulario.findAll({
            where: { utilizadorId },
            include: [{
                model: CampoFormulario,
                include: [{
                    model: Formulario,
                    where: { eventoId }
                }]
            }]
        });
        const formularios = formulariosRespondidos.map(resposta => resposta.CampoFormulario.Formulario);
        res.json(formularios);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao obter formulários respondidos para o evento' });
    }
};

// Obter formulários de um evento
exports.getFormulariosByEvento = async (req, res) => {
    try {
        const { eventoId } = req.params;
        const formularios = await Formulario.findAll({
            where: { eventoId, ativo: true },
            include: [{
                model: CampoFormulario,
                required: true
            }]
        });
        res.json(formularios);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao obter formulários para o evento' });
    }
};
