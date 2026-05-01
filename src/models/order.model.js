const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Order = sequelize.define('Order', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    plan_id: { type: DataTypes.INTEGER, allowNull: false },
    payment_gateway_order_id: { type: DataTypes.STRING, allowNull: false }, // Razorpay order id
    invoice_id: { type: DataTypes.STRING, allowNull: true },
    amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    currency: { type: DataTypes.STRING, allowNull: false, defaultValue: 'INR' },
    status: {
        type: DataTypes.ENUM('CREATED', 'ATTEMPTED', 'PAID', 'FAILED'),
        allowNull: false,
        defaultValue: 'CREATED'
    },
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    tableName: 'orders',
});

module.exports = Order;
