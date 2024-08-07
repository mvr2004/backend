const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');

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
  fotos: {
    type: DataTypes.STRING, // Novo campo para armazenar URL da foto
    allowNull: true
  }
}, {
  timestamps: false,
  hooks: {
    // Inserir dados pré-definidos após a sincronização inicial
    afterSync: async () => {
      try {
        const existingCentros = await Centro.count();
        if (existingCentros === 0) {
          await Centro.bulkCreate([
            { id: 1, centro: 'Viseu', fotos: 'https://backend-9hij.onrender.com/uploads/distritos/portugal_distritos_viseu.png' },
			{ id: 2, centro: 'Tomar', fotos: 'https://backend-9hij.onrender.com/uploads/distritos/portugal_distritos_santarem.png' },
			{ id: 3, centro: 'Fundao', fotos: 'https://backend-9hij.onrender.com/uploads/distritos/portugal_distritos_castelo-branco.png' },
			{ id: 4, centro: 'Portalegre', fotos: 'https://backend-9hij.onrender.com/uploads/distritos/portugal_distritos_portalegre.png' },
			{ id: 5, centro: 'Vila Real', fotos: 'https://backend-9hij.onrender.com/uploads/distritos/portugal_distritos_vila-real.png' },
			{ id: 6, centro: 'Liboa', fotos: 'https://backend-9hij.onrender.com/uploads/distritos/portugal_distritos_lisboa.png' }
          ]);
        }
      } catch (error) {
        console.error('Erro ao inserir dados pré-definidos de Centro:', error);
      }
    }
  }
});

module.exports = Centro;
