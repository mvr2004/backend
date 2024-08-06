const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');

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
    eventoId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ativo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    timestamps: false
});

module.exports = Formulario;
