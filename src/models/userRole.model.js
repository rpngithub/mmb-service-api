const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const UserRole = sequelize.define('UserRole', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  role_id: { type: DataTypes.INTEGER, allowNull: false },
}, {
  timestamps: false,
  tableName: 'user_roles',
});

module.exports = UserRole;
