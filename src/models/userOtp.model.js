const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const UserOtp = sequelize.define('UserOtp', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    transaction_id: { type: DataTypes.STRING, allowNull: false, unique: true }, // e.g. 'OTP12345'
    send_to: { type: DataTypes.STRING, allowNull: false }, // e.g. mobile number or email to which OTP is sent
    otp: { // otp hashed using bcrypt
        type: DataTypes.STRING,
        allowNull: false,
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    attempts: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
},
{
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'user_otp',
}
);

module.exports = UserOtp;
