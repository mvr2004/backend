const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');
const User = require('./User'); // Importe o modelo User aqui, se estiver em um arquivo separado
const Estabelecimento = require('./Estabelecimento'); // Importe o modelo Estabelecimento aqui, se estiver em um arquivo separado

const Avaliacao = sequelize.define('Avaliacao', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  avaliacao: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      max: 5
    }
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'User',
      key: 'id'
    }
  },
  estabelecimentoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Estabelecimento',
      key: 'id'
    }
  }
}, {
  timestamps: false
});

// Associações com User e Estabelecimento
Avaliacao.belongsTo(User, { foreignKey: 'userId' });
Avaliacao.belongsTo(Estabelecimento, { foreignKey: 'estabelecimentoId' });

module.exports = Avaliacao;
