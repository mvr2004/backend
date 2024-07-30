const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');
const bcrypt = require('bcrypt');
const Centro = require('./Centro');

const Admin = sequelize.define('Admin', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  centroId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Centros',
      key: 'id'
    }
  }
}, {
  timestamps: false,
  hooks: {
    // Antes de criar um novo admin
    beforeCreate: async (admin) => {
      // Verifica se a senha já está criptografada
      if (!admin.password.startsWith('$2b$')) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(admin.password, salt);
        admin.password = hashedPassword;
      }
    }
  }
});

// Inserir dados pré-definidos após a sincronização inicial
Admin.afterSync(async () => {
  try {
    const existingAdmins = await Admin.count();
    if (existingAdmins === 0) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('123', salt); 
      await Admin.bulkCreate([
        {
          nome: 'admin_Viseu',
          password: hashedPassword,
          centroId: 1, // ID do centro ao qual o admin está associado
        },
        {
          nome: 'admin_Tomar',
          password: hashedPassword,
          centroId: 2, // ID do centro ao qual o admin está associado
        }
        // Adicione mais registros conforme necessário
      ]);
    }
  } catch (error) {
    console.error('Erro ao inserir dados pré-definidos de Admin:', error);
  }
});

Admin.belongsTo(Centro, { foreignKey: 'centroId' });

module.exports = Admin;