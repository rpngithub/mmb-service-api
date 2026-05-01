const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Plan = sequelize.define('Plan', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  price: { type: DataTypes.DECIMAL(10,2), allowNull: false },
  duration: { type: DataTypes.INTEGER, allowNull: false },
  duration_unit: { type: DataTypes.ENUM('MONTH', 'YEAR'), allowNull: false },
  features: { type: DataTypes.JSONB },
  is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'plans',
});

module.exports = Plan;
