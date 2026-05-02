const planRepository = require('../repositories/plan.repository');

class PlanService {
  async createPlan(data) { return planRepository.create(data); }
  async getPlanById(id) { return planRepository.findById(id); }
  async getAllPlans(query) { return planRepository.findAll(query); }
  async getActivePlans() { return planRepository.findAll({ where: { is_deleted: false } }); }
  async updatePlan(id, data) { return planRepository.update(id, data); }
  async deletePlan(id) { return planRepository.delete(id); }
}

module.exports = new PlanService();
