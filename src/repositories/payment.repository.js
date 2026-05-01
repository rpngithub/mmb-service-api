const Payment = require('../models/payment.model');

class PaymentRepository {
  async create(data) { return Payment.create(data); }
  async findById(id) { return Payment.findByPk(id); }
  async findAll(query = {}) { return Payment.findAll(query); }
  async update(id, data) { return Payment.update(data, { where: { id } }); }
  async delete(id) { return Payment.destroy({ where: { id } }); }
}

module.exports = new PaymentRepository();
