const userAssetsRepository = require('../repositories/userAssets.repository');

class UserAssetsService {
  async createAsset(user_id, file_url) {
    return userAssetsRepository.create({ user_id, file_url });
  }

  async createBulk(user_id, file_urls) {
    return Promise.all(file_urls.map(file_url => userAssetsRepository.create({ user_id, file_url })));
  }

  async getAssetsByUserId(user_id) {
    return userAssetsRepository.findByUserId(user_id);
  }

  async deleteAsset(id, user_id) {
    const asset = await userAssetsRepository.findById(id);
    if (!asset) {
      const err = new Error('Asset not found');
      err.status = 404;
      throw err;
    }
    if (asset.user_id !== user_id) {
      const err = new Error('Forbidden');
      err.status = 403;
      throw err;
    }
    return userAssetsRepository.delete(id);
  }
}

module.exports = new UserAssetsService();
