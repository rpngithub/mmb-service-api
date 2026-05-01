const paymentRepository = require('../repositories/payment.repository');

class PaymentService {
  async createPayment(data) { return paymentRepository.create(data); }
  async getPaymentById(id) { return paymentRepository.findById(id); }
  async getAllPayments(query) { return paymentRepository.findAll(query); }
  async updatePayment(id, data) { return paymentRepository.update(id, data); }
  async deletePayment(id) { return paymentRepository.delete(id); }
}

module.exports = new PaymentService();
