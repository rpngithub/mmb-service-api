const FreeTrial = require('../models/freeTrial.model');

class FreeTrialRepository {
  async create(data) { return FreeTrial.create(data); }
  async findById(id) { return FreeTrial.findByPk(id); }
  async findAll(query = {}) { return FreeTrial.findAll(query); }
  async update(id, data) { return FreeTrial.update(data, { where: { id } }); }
  async delete(id) { return FreeTrial.destroy({ where: { id } }); }
  async findByUserId(user_id) { return FreeTrial.findOne({ where: { user_id } }); }
}

module.exports = new FreeTrialRepository();
