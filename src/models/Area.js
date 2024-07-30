const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');

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
  timestamps: false,
  hooks: {
    afterSync: async () => {
      try {
        const existingAreas = await Area.count();
        if (existingAreas === 0) {
          await Area.bulkCreate([
            { nomeArea: 'Saúde' },
            { nomeArea: 'Desporto' },
            { nomeArea: 'Formação' },
            { nomeArea: 'Gastronomia' },
            { nomeArea: 'Habitação/Alojamento' },
            { nomeArea: 'Transportes' },
            { nomeArea: 'Lazer' }
          ]);
        }
      } catch (error) {
        console.error('Erro ao inserir dados pré-definidos de Área:', error);
      }
    }
  }
});

module.exports = Area;