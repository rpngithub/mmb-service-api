const { v4: uuidv4 } = require('uuid');
const businessRepository = require('../repositories/business.repository');

class BusinessService {
  async createBusiness(data) {
    return businessRepository.create({ ...data, mnemonic_id: 'BUS' + uuidv4() });
  }
  async getBusinessById(mnemonic_id) { return businessRepository.findByMnemonicId(mnemonic_id); }
  async getAllBusinesses(query) { return businessRepository.findAll(query); }
  async updateBusiness(mnemonic_id, data) { return businessRepository.updateByMnemonicId(mnemonic_id, data); }
  async deleteBusiness(mnemonic_id) { return businessRepository.deleteByMnemonicId(mnemonic_id); }
}

module.exports = new BusinessService();
