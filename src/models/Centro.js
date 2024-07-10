const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig'); 

const Centro = sequelize.define('Centro', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  centro: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
}, {
  timestamps: false
});

module.exports = Centro;
