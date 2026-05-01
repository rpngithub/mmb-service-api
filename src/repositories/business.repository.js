const Business = require('../models/business.model');

class BusinessRepository {
  async create(data) { return Business.create(data); }
  async findById(id) { return Business.findByPk(id); }
  async findAll(query = {}) { return Business.findAll(query); }
  async update(id, data) { return Business.update(data, { where: { id } }); }
  async delete(id) { return Business.destroy({ where: { id } }); }
  async findByMnemonicId(mnemonic_id) { return Business.findOne({ where: { mnemonic_id } }); }
  async updateByMnemonicId(mnemonic_id, data) { return Business.update(data, { where: { mnemonic_id } }); }
  async deleteByMnemonicId(mnemonic_id) { return Business.destroy({ where: { mnemonic_id } }); }
}

module.exports = new BusinessRepository();
