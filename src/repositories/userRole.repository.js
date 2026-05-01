const UserRole = require('../models/userRole.model');

class UserRoleRepository {
  async create(data) { return UserRole.create(data); }
  async findAll(query = {}) { return UserRole.findAll(query); }
}

module.exports = new UserRoleRepository();
