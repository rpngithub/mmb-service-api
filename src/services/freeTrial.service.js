const freeTrialRepository = require('../repositories/freeTrial.repository');

class FreeTrialService {
  async createFreeTrial(data) { return freeTrialRepository.create(data); }
  async getFreeTrialById(id) { return freeTrialRepository.findById(id); }
  async getAllFreeTrials(query) { return freeTrialRepository.findAll(query); }
  async updateFreeTrial(id, data) { return freeTrialRepository.update(id, data); }
  async deleteFreeTrial(id) { return freeTrialRepository.delete(id); }
}

module.exports = new FreeTrialService();
