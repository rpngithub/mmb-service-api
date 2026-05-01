const Role = require('../models/role.model');

class RoleRepository {
  async findByName(name) { return Role.findOne({ where: { name } }); }
  async findAll() { return Role.findAll(); }
}

module.exports = new RoleRepository();
