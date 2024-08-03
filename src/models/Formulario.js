const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');
const Evento = require('./Evento');

const Formulario = sequelize.define('Formulario', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ativo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    eventoId: {
        type: DataTypes.INTEGER,
        references: {
            model: Evento,
            key: 'id'
        }
    }
}, {
    timestamps: false
});

Evento.hasMany(Formulario, { foreignKey: 'eventoId' });
Formulario.belongsTo(Evento, { foreignKey: 'eventoId' });

module.exports = Formulario;
