const userRoleRepository = require('../repositories/userRole.repository');

class UserRoleService {
  async assignRole(data) { return userRoleRepository.create(data); }
  async getAllUserRoles(query) { return userRoleRepository.findAll(query); }
}

module.exports = new UserRoleService();
