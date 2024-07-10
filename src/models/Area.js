const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig'); 

// Definindo o modelo Area
const Area = sequelize.define('Area', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nomeArea: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
}, {
  timestamps: false
});

module.exports = Area;
