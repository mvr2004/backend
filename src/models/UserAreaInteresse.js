const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');
const User = require('./User');
const AreaInteresse = require('./AreaInteresse');

const UserAreaInteresse = sequelize.define('UserAreaInteresse', {
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
  areaInteresseId: {
    type: DataTypes.INTEGER,
    references: {
      model: AreaInteresse,
      key: 'id'
    }
  },
}, {
  timestamps: false
});

User.belongsToMany(AreaInteresse, {
  through: UserAreaInteresse,
  foreignKey: 'userId',
  otherKey: 'areaInteresseId'
});

AreaInteresse.belongsToMany(User, {
  through: UserAreaInteresse,
  foreignKey: 'areaInteresseId',
  otherKey: 'userId'
});

module.exports = UserAreaInteresse;
