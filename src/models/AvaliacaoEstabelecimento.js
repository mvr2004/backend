const { sequelize } = require('../config/dbConfig'); 
const { DataTypes } = require('sequelize');
const User = require('./User');
const Estabelecimento = require('./Estabelecimento');

const AvEstabelecimento = sequelize.define('AvEstabelecimento', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    },
    establishmentId: {
        type: DataTypes.INTEGER,
        references: {
            model: Estabelecimento,
            key: 'id'
        }
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
}, {
    timestamps: true
});

User.hasMany(AvEstabelecimento, { foreignKey: 'userId' });
AvEstabelecimento.belongsTo(User, { foreignKey: 'userId' });

Estabelecimento.hasMany(AvEstabelecimento, { foreignKey: 'establishmentId' });
AvEstabelecimento.belongsTo(Estabelecimento, { foreignKey: 'establishmentId' });

module.exports = AvEstabelecimento;
