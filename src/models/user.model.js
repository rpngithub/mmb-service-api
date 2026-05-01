const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  mnemonic_id: { type: DataTypes.STRING, allowNull: false, unique: true }, // e.g. 'USR12345'
  role: { type: DataTypes.ENUM('ADMIN', 'USER', 'DESIGNER', 'CUSTOMER_SUPPORT'), defaultValue: 'USER' },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  mobile: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: true },
  mobile_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
  email_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'users',
});

module.exports = User;
