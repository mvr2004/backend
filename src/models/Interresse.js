const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');
const User = require('./User'); // Importe o modelo User aqui, se estiver em um arquivo separado
const Subarea = require('./Subarea'); // Importe o modelo Subarea aqui, se estiver em um arquivo separado

const Interesse = sequelize.define('Interesse', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'User',
      key: 'id'
    }
  },
  subareaId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Subarea',
      key: 'id'
    }
  }
}, {
  timestamps: false
});

// Associações com User e Subarea
Interesse.belongsTo(User, { foreignKey: 'userId' });
Interesse.belongsTo(Subarea, { foreignKey: 'subareaId' });

module.exports = Interesse;
