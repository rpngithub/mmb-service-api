const freeTrialRepository = require('../repositories/freeTrial.repository');

class FreeTrialService {
  async createFreeTrial(data) { return freeTrialRepository.create(data); }
  async getFreeTrialById(id) { return freeTrialRepository.findById(id); }
  async getAllFreeTrials(query) { return freeTrialRepository.findAll(query); }
  async updateFreeTrial(id, data) { return freeTrialRepository.update(id, data); }
  async deleteFreeTrial(id) { return freeTrialRepository.delete(id); }

  async activateFreeTrial(userId) {
    const existing = await freeTrialRepository.findByUserId(userId);
    if (existing) {
      const err = new Error('Free trial already used');
      err.status = 409;
      throw err;
    }

    const start_date = new Date();
    const end_date = new Date(start_date);
    end_date.setDate(end_date.getDate() + 2); 

    return freeTrialRepository.create({ user_id: userId, start_date, end_date, is_active: true });
  }
}

module.exports = new FreeTrialService();
