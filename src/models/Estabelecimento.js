const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');
const Subarea = require('./Subarea');

const Estabelecimento = sequelize.define('Estabelecimento', {
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
    contacto: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descriscao: {
        type: DataTypes.STRING,
        allowNull: true
    },
    pago: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    foto: {
        type: DataTypes.STRING,
        allowNull: true
    },
    subareaId: {
        type: DataTypes.INTEGER,
        references: {
            model: Subarea,
            key: 'id'
        }
    }
}, {
    timestamps: false
});

Subarea.hasMany(Estabelecimento, { foreignKey: 'subareaId' });
Estabelecimento.belongsTo(Subarea, { foreignKey: 'subareaId' });

module.exports = Estabelecimento;
