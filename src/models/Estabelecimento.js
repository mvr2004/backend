const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');
const Area = require('./Area'); // Importe o modelo Area aqui, se estiver em um arquivo separado
const Subarea = require('./Subarea'); // Importe o modelo Subarea aqui, se estiver em um arquivo separado

const Estabelecimento = sequelize.define('Estabelecimento', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  imagemUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  avaliacao: {
    type: DataTypes.FLOAT,
    validate: {
      min: 0,
      max: 5
    }
  },
  areaId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Area',
      key: 'id'
    }
  },
  subareaId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Subarea',
      key: 'id'
    }
  }
}, {
  timestamps: false
});

// Definindo as associações com Area e Subarea
Estabelecimento.belongsTo(Area, { foreignKey: 'areaId' });
Estabelecimento.belongsTo(Subarea, { foreignKey: 'subareaId' });

module.exports = Estabelecimento;
