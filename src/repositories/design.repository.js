const Design = require('../models/design.model');

class DesignRepository {
  async create(data) { return Design.create(data); }
  async findById(id) { return Design.findByPk(id); }
  async findAll(query = {}) { return Design.findAll(query); }
  async update(id, data) { return Design.update(data, { where: { id } }); }
  async delete(id) { return Design.destroy({ where: { id } }); }
}

module.exports = new DesignRepository();
