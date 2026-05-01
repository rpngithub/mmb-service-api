const { DataTypes } = require('sequelize');
const sequelize = require('./index');

// design_preference_master
// - id
// - type (POST_TYPE, STYLE, TONE)
// - label
const DesignPreferenceMaster = sequelize.define('DesignPreferenceMaster', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    type: { type: DataTypes.ENUM('POST_TYPE', 'STYLE', 'TONE'), allowNull: false },
    label: { type: DataTypes.STRING, allowNull: false }, // e.g. for POST_TYPE: 'Informative', 'Promotional', 'Engaging', etc.
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'design_preference_master',
});

module.exports = DesignPreferenceMaster;
