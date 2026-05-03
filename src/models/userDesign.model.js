const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const UserDesign = sequelize.define('UserDesign', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  mnemonic_id: { type: DataTypes.STRING, allowNull: false, unique: true }, // prefix: UDS
  user_business_id: { type: DataTypes.INTEGER, allowNull: false },
  subscription_id: { type: DataTypes.INTEGER, allowNull: true },
  free_trial_id: { type: DataTypes.INTEGER, allowNull: true },
  design_id: { type: DataTypes.INTEGER, allowNull: false },
  is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'user_designs',
});

module.exports = UserDesign;
