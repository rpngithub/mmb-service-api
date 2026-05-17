const sequelize = require('../models/index');
const subscriptionRepository = require('../repositories/subscription.repository');
const orderService = require('./order.service');
const paymentService = require('./payment.service');
const planService = require('./plan.service');
const userService = require('./user.service');
const razorpayUtil = require('../utils/razorpay.util');
const { sendMail } = require('../utils/mailer.util');
const { generateInvoicePdf } = require('../utils/invoice.util');

class SubscriptionService {
  async createSubscription(data) { return subscriptionRepository.create(data); }
  async getSubscriptionById(id) { return subscriptionRepository.findById(id); }
  async getAllSubscriptions(query) { return subscriptionRepository.findAll(query); }
  async updateSubscription(id, data) { return subscriptionRepository.update(id, data); }
  async deleteSubscription(id) { return subscriptionRepository.delete(id); }
  async getActiveSubscriptionByUserId(user_id) { return subscriptionRepository.findActiveByUserId(user_id); }

  async checkout(userId, planId, planDurationUnit = 'MONTH') {
    
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
    const planPrice = parseFloat(plan.price);
    const quantity = planDurationUnit === 'MONTH' ? 1 : 12;
    const amountQuantity = planDurationUnit === 'MONTH' ? 1 : 10; // For yearly plans, we can offer a discount (e.g., 10% off), so quantity is 10 instead of 12 for price calculation
    const totalPlanPrice = parseFloat((planPrice * amountQuantity).toFixed(2));
    const gstAmount = parseFloat((totalPlanPrice * 0.18).toFixed(2)); // Assuming 18% GST
    const totalAmount = parseFloat((totalPlanPrice + gstAmount).toFixed(2));
    const razorpayOrder = await razorpayUtil.createOrder(totalAmount, 'INR', receipt);
    

    const dbOrder = await orderService.createOrder({
      user_id: userId,
      plan_id: planId,
      payment_gateway_order_id: razorpayOrder.id,
      invoice_id: receipt,
      price: planPrice,
      gst: gstAmount,
      amount: totalAmount,
      quantity: quantity,
      plan_duration_unit: planDurationUnit,
      currency: 'INR',
      status: 'CREATED',
    });

    return {
      order_id: dbOrder.id,
      razorpay_order_id: razorpayOrder.id,
      amount: Math.round(totalAmount * 100),
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
        price: dbOrder.price,
        gst: dbOrder.gst,
        amount: dbOrder.amount,
        status: 'FAILED',
        failure_reason: 'Signature verification failed',
      });
      const err = new Error('Payment verification failed');
      err.status = 400;
      throw err;
    }

    let newSub, plan;
    await sequelize.transaction(async () => {
      await orderService.updateOrder(order_id, { status: 'PAID' });

      const payment = await paymentService.createPayment({
        order_id,
        payment_gateway_payment_id: razorpay_payment_id,
        amount: dbOrder.amount,
        status: 'SUCCESS',
      });

      plan = await planService.getPlanById(dbOrder.plan_id);
      if (!plan) throw new Error('Plan not found');

      const start_date = new Date();
      const end_date = new Date(start_date);
      if (plan.duration_unit === 'MONTH') {
        end_date.setMonth(end_date.getMonth() + dbOrder.quantity);
      } else {
        end_date.setFullYear(end_date.getFullYear() + dbOrder.quantity);
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
        payment_id: payment.id,
      });
    });

    try {
      const user = await userService.getUserById(userId);
      const pdfBuffer = await generateInvoicePdf({ user, plan, order: dbOrder, subscription: newSub });
      await sendMail({
        to: user.email,
        subject: 'Your MakeMyBrand Subscription Invoice',
        html: `<p>Hi ${user.name},</p><p>Your subscription to <b>${plan.name}</b> is now active. Please find your invoice attached.</p><p>Thank you for choosing MakeMyBrand!</p>`,
        attachments: [{ filename: `invoice_${dbOrder.invoice_id}.pdf`, content: pdfBuffer }],
      });
    } catch (emailErr) {
      console.error('Invoice email failed:', emailErr.message);
    }

    return {
      message: 'Payment verified. Subscription activated.',
      subscription: {
        id: newSub.id,
        plan_id: newSub.plan_id,
        plan_name: plan.name,
        start_date: newSub.start_date,
        end_date: newSub.end_date,
        status: newSub.status,
      },
    };
  }
}

module.exports = new SubscriptionService();
