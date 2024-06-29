// src/models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

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
    defaultValue: false
  },
  emailConfirmed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  confirmationCode: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  // Disable timestamps
  timestamps: false
});

module.exports = User;
