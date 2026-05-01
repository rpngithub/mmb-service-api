const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const UserBusinessPreference = sequelize.define('UserBusinessPreference', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_business_id: { type: DataTypes.INTEGER, allowNull: false },
    preference_id: { type: DataTypes.INTEGER, allowNull: false },
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'user_business_preferences',
});

module.exports = UserBusinessPreference;