const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig'); 
const Utilizador = require('./User');
const Evento = require('./Evento');

const ParticipacaoEvento = sequelize.define('ParticipacaoEvento', {
    utilizadorId: {
        type: DataTypes.INTEGER,
        references: {
            model: Utilizador,
            key: 'id'
        }
    },
    eventoId: {
        type: DataTypes.INTEGER,
        references: {
            model: Evento,
            key: 'id'
        }
    }
}, {
    timestamps: true
});

Utilizador.belongsToMany(Evento, { through: ParticipacaoEvento, foreignKey: 'utilizadorId' });
Evento.belongsToMany(Utilizador, { through: ParticipacaoEvento, foreignKey: 'eventoId' });

module.exports = ParticipacaoEvento;
