const orderRepository = require('../repositories/order.repository');

class OrderService {
  async createOrder(data) { return orderRepository.create(data); }
  async getOrderById(id) { return orderRepository.findById(id); }
  async getAllOrders(query) { return orderRepository.findAll(query); }
  async updateOrder(id, data) { return orderRepository.update(id, data); }
  async deleteOrder(id) { return orderRepository.delete(id); }
}

module.exports = new OrderService();
