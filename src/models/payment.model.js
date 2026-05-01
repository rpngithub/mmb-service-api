const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Payment = sequelize.define('Payment', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    order_id: { type: DataTypes.INTEGER, allowNull: false }, // FK to orders
    payment_gateway_payment_id: { type: DataTypes.STRING, allowNull: false }, // Razorpay payment id
    amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    status: {
        type: DataTypes.ENUM('SUCCESS', 'FAILED'),
        allowNull: false,
        defaultValue: 'FAILED'
    },
    method: {
        type: DataTypes.ENUM('UPI', 'CARD', 'NETBANKING', 'WALLET', 'CASH'),
        allowNull: true
    },
    failure_reason: { type: DataTypes.STRING, allowNull: true },
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    tableName: 'payments',
});

module.exports = Payment;
