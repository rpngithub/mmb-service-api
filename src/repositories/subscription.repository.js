const Subscription = require('../models/subscription.model');

class SubscriptionRepository {
  async create(data) { return Subscription.create(data); }
  async findById(id) { return Subscription.findByPk(id); }
  async findAll(query = {}) { return Subscription.findAll(query); }
  async update(id, data) { return Subscription.update(data, { where: { id } }); }
  async delete(id) { return Subscription.destroy({ where: { id } }); }
  async findActiveByUserId(user_id) {
    return Subscription.findOne({
      where: { user_id, status: 'active', end_date: { [Op.gt]: new Date() } }, // need to add logic end date > now
      order: [['created_at', 'DESC']],
    });
  }
}

module.exports = new SubscriptionRepository();
