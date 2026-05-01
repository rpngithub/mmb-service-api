const UserDesign = require('../models/userDesign.model');

class UserDesignRepository {
  async create(data) { return UserDesign.create(data); }

  async findAll(where = {}) {
    return UserDesign.findAll({ where: { ...where, is_deleted: false } });
  }

  async findByMnemonicId(mnemonic_id) {
    return UserDesign.findOne({ where: { mnemonic_id, is_deleted: false } });
  }

  async findByUserBusinessId(user_business_id) {
    return UserDesign.findAll({ where: { user_business_id, is_deleted: false } });
  }

  async updateByMnemonicId(mnemonic_id, data) {
    return UserDesign.update(data, { where: { mnemonic_id } });
  }

  async softDeleteByMnemonicId(mnemonic_id) {
    return UserDesign.update({ is_deleted: true }, { where: { mnemonic_id } });
  }
}

module.exports = new UserDesignRepository();
