const User = require('../models/user.model');

class UserRepository {
  async create(data) { return User.create(data); }
  async findById(id) { return User.findByPk(id); }
  async findAll(query = {}) { return User.findAll(query); }
  async update(id, data) { return User.update(data, { where: { id } }); }
  async delete(id) { return User.destroy({ where: { id } }); }
  // need to check if mobile exists
  async findByMobile(mobile) { return User.findOne({ where: { mobile } }); }
  // need to check if email exists
  async findByEmail(email) { return User.findOne({ where: { email } }); }
  async findByMnemonicId(mnemonic_id) { return User.findOne({ where: { mnemonic_id } }); }
}

module.exports = new UserRepository();
