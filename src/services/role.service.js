const roleRepository = require('../repositories/role.repository');

class RoleService {
  async getRoleByName(name) { return roleRepository.findByName(name); }
  async getAllRoles() { return roleRepository.findAll(); }
}

module.exports = new RoleService();
