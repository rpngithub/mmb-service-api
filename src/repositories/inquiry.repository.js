const Inquiry = require('../models/inquiry.model');

class InquiryRepository {
  async create(data) { return Inquiry.create(data); }
  async findById(id) { return Inquiry.findByPk(id); }
  async findAll(query = {}) { return Inquiry.findAndCountAll(query); }
  async update(id, data) {
    await Inquiry.update(data, { where: { id } });
    return Inquiry.findByPk(id);
  }
}

module.exports = new InquiryRepository();
