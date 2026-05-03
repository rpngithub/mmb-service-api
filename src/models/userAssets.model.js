const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const UserAssets = sequelize.define('UserAssets', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  file_url: { type: DataTypes.TEXT, allowNull: false },
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'user_assets',
});

module.exports = UserAssets;
