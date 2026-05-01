const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createOrder = async (amount, currency = 'INR', receipt) => {
  return razorpay.orders.create({
    amount: Math.round(amount * 100), // Razorpay expects paise
    currency,
    receipt,
  });
};

const verifySignature = (order_id, payment_id, signature) => {
  const crypto = require('crypto');
  const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
  hmac.update(order_id + '|' + payment_id);
  const digest = hmac.digest('hex');
  return digest === signature;
};

module.exports = { razorpay, createOrder, verifySignature };
