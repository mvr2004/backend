// models/User.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');
const Centro = require('./Centro');
const UserAreaInteresse = require('./UserAreaInteresse'); // Importe a tabela de associação

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  photoUrl: {
    type: DataTypes.STRING
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  emailConfirmed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  confirmationCode: {
    type: DataTypes.STRING,
    allowNull: true
  },
  firstLogin: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  notas: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  centroId: {
    type: DataTypes.INTEGER,
    references: {
      model: Centro,
      key: 'id'
    }
  }
}, {
  timestamps: false
});

User.belongsTo(Centro, { foreignKey: 'centroId' });
User.belongsToMany(AreaInteresse, { through: UserAreaInteresse, foreignKey: 'userId' });

module.exports = User;
