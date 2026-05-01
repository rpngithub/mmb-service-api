const subscriptionRepository = require('../repositories/subscription.repository');

class SubscriptionService {
  async createSubscription(data) { return subscriptionRepository.create(data); }
  async getSubscriptionById(id) { return subscriptionRepository.findById(id); }
  async getAllSubscriptions(query) { return subscriptionRepository.findAll(query); }
  async updateSubscription(id, data) { return subscriptionRepository.update(id, data); }
  async deleteSubscription(id) { return subscriptionRepository.delete(id); }
  async getActiveSubscriptionByUserId(user_id) { return subscriptionRepository.findActiveByUserId(user_id); }
}

module.exports = new SubscriptionService();
