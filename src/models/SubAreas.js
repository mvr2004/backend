const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');
const Area = require('./Area'); // Importe o modelo Area aqui, se estiver em um arquivo separado

const Subarea = sequelize.define('Subarea', {
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
  areaId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Area',
      key: 'id'
    }
  },
}, {
  timestamps: false
});

// Definindo a associação com Area
Subarea.belongsTo(Area, { foreignKey: 'areaId' });

module.exports = Subarea;
