const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');
const Area = require('./Area');

const Subarea = sequelize.define('Subarea', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nomeSubarea: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  areaId: {
    type: DataTypes.INTEGER,
    references: {
      model: Area,
      key: 'id'
    }
  }
}, {
  timestamps: false
});

// Definindo a associação
Area.hasMany(Subarea, { foreignKey: 'areaId' });
Subarea.belongsTo(Area, { foreignKey: 'areaId' });

module.exports = Subarea;
