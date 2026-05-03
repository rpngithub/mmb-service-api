const subscriptionService = require('../services/subscription.service');
const freeTrialService = require('../services/freeTrial.service');
const userService = require('../services/user.service');

exports.activateFreeTrial = async (req, res, next) => {
  try {
    const user = await userService.getUserByMnemonicId(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const freeTrial = await freeTrialService.activateFreeTrial(user.id);
    res.status(201).json(freeTrial);
  } catch (err) { next(err); }
};

exports.checkout = async (req, res, next) => {
  try {
    const user = await userService.getUserByMnemonicId(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const result = await subscriptionService.checkout(user.id, req.body.plan_id);
    res.status(201).json(result);
  } catch (err) { next(err); }
};

exports.verifyPayment = async (req, res, next) => {
  try {
    const user = await userService.getUserByMnemonicId(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const result = await subscriptionService.verifyPayment(user.id, req.body);
    res.json(result);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const subscription = await subscriptionService.createSubscription(req.body);
    res.status(201).json(subscription);
  } catch (err) { next(err); }
};

exports.getAll = async (req, res, next) => {
  try {
    const subscriptions = await subscriptionService.getAllSubscriptions();
    res.json(subscriptions);
  } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
  try {
    const subscription = await subscriptionService.getSubscriptionById(req.params.id);
    if (!subscription) return res.status(404).json({ error: 'Subscription not found' });
    res.json(subscription);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    await subscriptionService.updateSubscription(req.params.id, req.body);
    res.json({ message: 'Subscription updated' });
  } catch (err) { next(err); }
};

exports.delete = async (req, res, next) => {
  try {
    await subscriptionService.deleteSubscription(req.params.id);
    res.json({ message: 'Subscription deleted' });
  } catch (err) { next(err); }
};
