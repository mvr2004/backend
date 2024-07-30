const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');
const bcrypt = require('bcrypt');

const Centro = sequelize.define('Centro', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true // Mantém o autoIncrement ativado
  },
  centro: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
}, {
  timestamps: false,
  hooks: {
    // Inserir dados pré-definidos após a sincronização inicial
    afterSync: async () => {
      try {
        const existingCentros = await Centro.count();
        if (existingCentros === 0) {
          await Centro.bulkCreate([
            { id: 1, centro: 'Viseu' },
            { id: 2, centro: 'Tomar' },
          ]);
        }
      } catch (error) {
        console.error('Erro ao inserir dados pré-definidos de Centro:', error);
      }
    }
  }
});

module.exports = Centro;