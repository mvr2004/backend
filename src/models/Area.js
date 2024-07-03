const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const Area = sequelize.define('Area', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
}, {
  timestamps: false
});

module.exports = Area;
