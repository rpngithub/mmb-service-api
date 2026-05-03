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
    end_date.setDate(end_date.getDate() + 2); // 2 days trial

    return freeTrialRepository.create({ user_id: userId, start_date, end_date, is_active: true });
  }

  async getActiveFreeTrialByUserId(user_id) {
    const freeTrial = await freeTrialRepository.findByUserId(user_id);
    // need to check expiry here as well in case user has an old free trial that is expired but not marked inactive
    if (freeTrial && freeTrial.is_active) {
      const now = new Date();
      if (now <= new Date(freeTrial.end_date)) {
        return freeTrial;
      } else {
        // mark the free trial as inactive if it has expired
        await freeTrialRepository.update(freeTrial.id, { is_active: false });
      }
    }
    return null;
  }

}

module.exports = new FreeTrialService();
