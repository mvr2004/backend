const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');
const User = require('./User'); // Importe o modelo User aqui, se estiver em um arquivo separado

const Report = sequelize.define('Report', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  descricaoProblema: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  imagemUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  statusResolvido: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false // Pode ser false (não resolvido) ou true (resolvido)
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'User',
      key: 'id'
    }
  }
}, {
  timestamps: false
});

// Associação com User
Report.belongsTo(User, { foreignKey: 'userId' });

module.exports = Report;
