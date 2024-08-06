const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');
const Formulario = require('./Formulario');
const Utilizador = require('./Utilizador');
const CampoFormulario = require('./CampoFormulario');

const RespostaFormulario = sequelize.define('RespostaFormulario', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    resposta: {
        type: DataTypes.STRING,
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
RespostaFormulario.belongsTo(Utilizador, { foreignKey: 'utilizadorId' });

module.exports = RespostaFormulario;
