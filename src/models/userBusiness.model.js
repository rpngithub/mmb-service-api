const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const UserBusiness = sequelize.define('UserBusiness', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    mnemonic_id: { type: DataTypes.STRING, allowNull: false, unique: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    business_id: { type: DataTypes.INTEGER, allowNull: true },
    business_other: { type: DataTypes.STRING, allowNull: true }, // if business_id is 'Other', specify here
    brand_name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    email: { type: DataTypes.STRING, allowNull: true },
    phone_number: { type: DataTypes.STRING, allowNull: true },
    mobile_number: { type: DataTypes.STRING, allowNull: true },
    logo: { type: DataTypes.STRING, allowNull: true },
    website: { type: DataTypes.STRING, allowNull: true },
    address: { type: DataTypes.STRING, allowNull: true },
    city: { type: DataTypes.STRING, allowNull: true },
    state: { type: DataTypes.STRING, allowNull: true },
    zip_code: { type: DataTypes.STRING, allowNull: true },
    country: { type: DataTypes.STRING, allowNull: true },
    youtube_link: { type: DataTypes.STRING, allowNull: true },
    facebook_link: { type: DataTypes.STRING, allowNull: true },
    instagram_link: { type: DataTypes.STRING, allowNull: true },
    linkedin_link: { type: DataTypes.STRING, allowNull: true },
    design_preferences: { type: DataTypes.JSONB, allowNull: true }, // { postType: [], designStyle: [], contentTone: [] }
    reference_link: { type: DataTypes.STRING, allowNull: true }, // comma separated list of links
    delivery_preference: { type: DataTypes.ENUM('Whatsapp', 'Email'), allowNull: true },
    branding_status: { type: DataTypes.ENUM('READY', 'ONLY_LOGO', 'NEED_HELP'), defaultValue: 'NEED_HELP' },
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'user_businesses',
});

module.exports = UserBusiness;
