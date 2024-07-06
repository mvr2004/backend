const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');
const Subarea = require('./Subarea');
const Utilizador = require('./User');

const Evento = sequelize.define('Evento', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    localizacao: {
        type: DataTypes.STRING,
        allowNull: false
    },
    data: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    hora: {
        type: DataTypes.TIME,
        allowNull: false
    },
    descricao: {
        type: DataTypes.STRING,
        allowNull: true
    },
    subareaId: {
        type: DataTypes.INTEGER,
        references: {
            model: Subarea,
            key: 'id'
        }
    },
    utilizadorId: {
        type: DataTypes.INTEGER,
        references: {
            model: Utilizador,
            key: 'id'
        }
    }
}, {
    timestamps: true
});

Subarea.hasMany(Evento, { foreignKey: 'subareaId' });
Evento.belongsTo(Subarea, { foreignKey: 'subareaId' });

Utilizador.hasMany(Evento, { foreignKey: 'utilizadorId' });
Evento.belongsTo(Utilizador, { foreignKey: 'utilizadorId' });

module.exports = Evento;
