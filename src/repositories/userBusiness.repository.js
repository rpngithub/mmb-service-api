const UserBusiness = require('../models/userBusiness.model');

class UserBusinessRepository {
  async create(data) { return UserBusiness.create(data); }
  async findById(id) { return UserBusiness.findByPk(id); }
  async findAll(query = {}) { return UserBusiness.findAll(query); }
  async update(id, data) { return UserBusiness.update(data, { where: { id } }); }
  async delete(id) { return UserBusiness.destroy({ where: { id } }); }
  async findByMnemonicId(mnemonic_id) { return UserBusiness.findOne({ where: { mnemonic_id } }); }
  async findByUserId(user_id) { return UserBusiness.findOne({ where: { user_id } }); }
  async updateByMnemonicId(mnemonic_id, data) { return UserBusiness.update(data, { where: { mnemonic_id } }); }
  async deleteByMnemonicId(mnemonic_id) { return UserBusiness.destroy({ where: { mnemonic_id } }); }
}

module.exports = new UserBusinessRepository();
