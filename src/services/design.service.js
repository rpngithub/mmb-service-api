const designRepository = require('../repositories/design.repository');

class DesignService {
  async createDesign(data) { return designRepository.create(data); }
  async getDesignById(id) { return designRepository.findById(id); }
  async getAllDesigns(query) { return designRepository.findAll(query); }
  async updateDesign(id, data) { return designRepository.update(id, data); }
  async deleteDesign(id) { return designRepository.delete(id); }
}

module.exports = new DesignService();
