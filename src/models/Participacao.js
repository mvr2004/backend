const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');
const User = require('./User'); // Importe o modelo User aqui, se estiver em um arquivo separado
const Evento = require('./Evento'); // Importe o modelo Evento aqui, se estiver em um arquivo separado

const Participacao = sequelize.define('Participacao', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false // Pode ser false (não confirmado) ou true (confirmado)
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'User',
      key: 'id'
    }
  },
  eventoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Evento',
      key: 'id'
    }
  }
}, {
  timestamps: false
});

// Associações com User e Evento
Participacao.belongsTo(User, { foreignKey: 'userId' });
Participacao.belongsTo(Evento, { foreignKey: 'eventoId' });

module.exports = Participacao;
