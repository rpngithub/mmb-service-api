const { v4: uuidv4 } = require('uuid');
const businessRepository = require('../repositories/business.repository');

class BusinessService {
  async createBusiness(data) {
    return businessRepository.create({ ...data, mnemonic_id: 'BUS' + uuidv4() });
  }
  async getBusinessById(id) { return businessRepository.findById(id); }
  async getBusinessByMnemonic(mnemonic_id) { return businessRepository.findByMnemonicId(mnemonic_id); }
  async getAllBusinesses(query) { return businessRepository.findAll(query); }
  async getActiveBusinesses() { return businessRepository.findAll({ where: { is_deleted: false } }); }
  async updateBusiness(mnemonic_id, data) { return businessRepository.updateByMnemonicId(mnemonic_id, data); }
  async deleteBusiness(mnemonic_id) { return businessRepository.deleteByMnemonicId(mnemonic_id); }
}

module.exports = new BusinessService();
