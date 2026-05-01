const Plan = require('../models/plan.model');

class PlanRepository {
  async create(data) { return Plan.create(data); }
  async findById(id) { return Plan.findByPk(id); }
  async findAll(query = {}) { return Plan.findAll(query); }
  async update(id, data) { return Plan.update(data, { where: { id } }); }
  async delete(id) { return Plan.destroy({ where: { id } }); }
}

module.exports = new PlanRepository();
