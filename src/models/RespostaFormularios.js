const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');
const CampoFormulario = require('./CampoFormulario');
const Utilizador = require('./Utilizador');

const RespostaFormulario = sequelize.define('RespostaFormulario', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    resposta: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    campoFormularioId: {
        type: DataTypes.INTEGER,
        references: {
            model: CampoFormulario,
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
    timestamps: false
});

CampoFormulario.hasMany(RespostaFormulario, { foreignKey: 'campoFormularioId' });
RespostaFormulario.belongsTo(CampoFormulario, { foreignKey: 'campoFormularioId' });

Utilizador.hasMany(RespostaFormulario, { foreignKey: 'utilizadorId' });
RespostaFormulario.belongsTo(Utilizador, { foreignKey: 'utilizadorId' });

module.exports = RespostaFormulario;
