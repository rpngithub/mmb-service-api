const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const TokenBlacklist = sequelize.define('TokenBlacklist', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  jti: { type: DataTypes.STRING, allowNull: false, unique: true },
  expires_at: { type: DataTypes.DATE, allowNull: false },
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
  tableName: 'token_blacklist',
});

module.exports = TokenBlacklist;
