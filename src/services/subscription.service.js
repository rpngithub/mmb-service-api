const sequelize = require('../models/index');
const subscriptionRepository = require('../repositories/subscription.repository');
const orderService = require('./order.service');
const paymentService = require('./payment.service');
const planService = require('./plan.service');
const razorpayUtil = require('../utils/razorpay.util');

class SubscriptionService {
  async createSubscription(data) { return subscriptionRepository.create(data); }
  async getSubscriptionById(id) { return subscriptionRepository.findById(id); }
  async getAllSubscriptions(query) { return subscriptionRepository.findAll(query); }
  async updateSubscription(id, data) { return subscriptionRepository.update(id, data); }
  async deleteSubscription(id) { return subscriptionRepository.delete(id); }
  async getActiveSubscriptionByUserId(user_id) { return subscriptionRepository.findActiveByUserId(user_id); }

  async checkout(userId, planId) {
    
    const plan = await planService.getPlanById(planId);
    if (!plan || plan.is_deleted) {
      const err = new Error('Plan not found');
      err.status = 404;
      throw err;
    }

    const existingSub = await subscriptionRepository.findActiveByUserId(userId);
    if (existingSub && existingSub.plan_id === planId) {
      const err = new Error('Already subscribed to this plan');
      err.status = 409;
      throw err;
    }

    const receipt = `receipt_${userId}_${planId}_${Date.now()}`;
    const razorpayOrder = await razorpayUtil.createOrder(plan.price, 'INR', receipt);

    const dbOrder = await orderService.createOrder({
      user_id: userId,
      plan_id: planId,
      payment_gateway_order_id: razorpayOrder.id,
      amount: plan.price,
      currency: 'INR',
      status: 'CREATED',
    });

    return {
      order_id: dbOrder.id,
      razorpay_order_id: razorpayOrder.id,
      amount: Math.round(plan.price * 100),
      currency: 'INR',
      key_id: process.env.RAZORPAY_KEY_ID,
      plan: {
        id: plan.id,
        name: plan.name,
        duration: plan.duration,
        duration_unit: plan.duration_unit,
      },
    };
  }

  async verifyPayment(userId, body) {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = body;

    const dbOrder = await orderService.getOrderById(order_id);
    if (!dbOrder) {
      const err = new Error('Order not found');
      err.status = 404;
      throw err;
    }

    if (dbOrder.user_id !== userId) {
      const err = new Error('Forbidden');
      err.status = 403;
      throw err;
    }

    if (dbOrder.payment_gateway_order_id !== razorpay_order_id) {
      const err = new Error('Order ID mismatch');
      err.status = 400;
      throw err;
    }

    if (dbOrder.status === 'PAID') {
      const err = new Error('Payment already verified for this order');
      err.status = 409;
      throw err;
    }

    const isValid = razorpayUtil.verifySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);

    if (!isValid) {
      await orderService.updateOrder(order_id, { status: 'FAILED' });
      await paymentService.createPayment({
        order_id,
        payment_gateway_payment_id: razorpay_payment_id,
        amount: dbOrder.amount,
        status: 'FAILED',
        failure_reason: 'Signature verification failed',
      });
      const err = new Error('Payment verification failed');
      err.status = 400;
      throw err;
    }

    let newSub;
    await sequelize.transaction(async () => {
      await orderService.updateOrder(order_id, { status: 'PAID' });

      await paymentService.createPayment({
        order_id,
        payment_gateway_payment_id: razorpay_payment_id,
        amount: dbOrder.amount,
        status: 'SUCCESS',
      });

      const plan = await planService.getPlanById(dbOrder.plan_id);
      if (!plan) throw new Error('Plan not found');

      const start_date = new Date();
      const end_date = new Date(start_date);
      if (plan.duration_unit === 'MONTH') {
        end_date.setMonth(end_date.getMonth() + plan.duration);
      } else {
        end_date.setFullYear(end_date.getFullYear() + plan.duration);
      }

      const activeSub = await subscriptionRepository.findActiveByUserId(userId);
      if (activeSub) {
        await subscriptionRepository.update(activeSub.id, { status: 'upgraded' });
      }

      newSub = await subscriptionRepository.create({
        user_id: userId,
        plan_id: dbOrder.plan_id,
        start_date,
        end_date,
        status: 'active',
      });
    });

    return {
      message: 'Payment verified. Subscription activated.',
      subscription: {
        id: newSub.id,
        plan_id: newSub.plan_id,
        start_date: newSub.start_date,
        end_date: newSub.end_date,
        status: newSub.status,
      },
    };
  }
}

module.exports = new SubscriptionService();
