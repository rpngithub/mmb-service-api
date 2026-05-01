const Order = require('../models/order.model');

class OrderRepository {
  async create(data) { return Order.create(data); }
  async findById(id) { return Order.findByPk(id); }
  async findAll(query = {}) { return Order.findAll(query); }
  async update(id, data) { return Order.update(data, { where: { id } }); }
  async delete(id) { return Order.destroy({ where: { id } }); }
}

module.exports = new OrderRepository();
