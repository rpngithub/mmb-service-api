const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Inquiry = sequelize.define('Inquiry', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  inquiry_number: { type: DataTypes.STRING, allowNull: false, unique: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: true },
  query_type: { type: DataTypes.STRING, allowNull: true },
  notes: { type: DataTypes.TEXT, allowNull: false },
  status: {
    type: DataTypes.ENUM('new', 'in_progress', 'resolved'),
    allowNull: false,
    defaultValue: 'new',
  },
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'inquiries',
});

module.exports = Inquiry;
