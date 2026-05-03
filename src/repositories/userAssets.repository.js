const UserAssets = require('../models/userAssets.model');

class UserAssetsRepository {
  async create(data) { return UserAssets.create(data); }
  async findById(id) { return UserAssets.findByPk(id); }
  async findByUserId(user_id) { return UserAssets.findAll({ where: { user_id } }); }
  async delete(id) { return UserAssets.destroy({ where: { id } }); }
}

module.exports = new UserAssetsRepository();
