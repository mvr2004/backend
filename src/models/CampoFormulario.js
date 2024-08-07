const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');
const Formulario = require('./Formulario');

const CampoFormulario = sequelize.define('CampoFormulario', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tipo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    opcoes: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    formularioId: {
        type: DataTypes.INTEGER,
        references: {
            model: Formulario,
            key: 'id'
        }
    }
}, {
    timestamps: false
});

Formulario.hasMany(CampoFormulario, { foreignKey: 'formularioId' });
CampoFormulario.belongsTo(Formulario, { foreignKey: 'formularioId' });

module.exports = CampoFormulario;
