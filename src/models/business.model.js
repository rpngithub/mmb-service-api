const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Business = sequelize.define('Business', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    mnemonic_id: { type: DataTypes.STRING, allowNull: false, unique: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    parent: { type: DataTypes.INTEGER, allowNull: true },
    is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'businesses',
});

module.exports = Business;
