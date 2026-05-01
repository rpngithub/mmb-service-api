const { v4: uuidv4 } = require('uuid');
const userBusinessRepository = require('../repositories/userBusiness.repository');

class UserBusinessService {
  async createUserBusiness(data) {
    return userBusinessRepository.create({ ...data, mnemonic_id: 'UBN' + uuidv4() });
  }
  async getUserBusinessById(mnemonic_id) { return userBusinessRepository.findByMnemonicId(mnemonic_id); }
  async getAllUserBusinesses(query) { return userBusinessRepository.findAll(query); }
  async updateUserBusiness(mnemonic_id, data) { return userBusinessRepository.updateByMnemonicId(mnemonic_id, data); }
  async deleteUserBusiness(mnemonic_id) { return userBusinessRepository.deleteByMnemonicId(mnemonic_id); }
  async getUserBusinessByUserId(user_id) { return userBusinessRepository.findByUserId(user_id); }
  async upsertUserBusiness(user_id, data) {
    const existing = await userBusinessRepository.findByUserId(user_id);
    if (existing) {
      await userBusinessRepository.updateByMnemonicId(existing.mnemonic_id, data);
      return userBusinessRepository.findByUserId(user_id);
    }
    return userBusinessRepository.create({ ...data, user_id, mnemonic_id: 'UBN' + uuidv4() });
  }
}

module.exports = new UserBusinessService();
