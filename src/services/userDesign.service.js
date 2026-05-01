const { v4: uuidv4 } = require('uuid');
const path = require('path');
const userDesignRepository = require('../repositories/userDesign.repository');
const designRepository = require('../repositories/design.repository');

class UserDesignService {
  // Creates one Design record + one UserDesign record per uploaded file.
  // Returns array of created userDesign records with their linked design.
  async createFromFiles(files, { user_business_id, subscription_id, created_by, description, visibility }) {
    const results = [];
    for (const file of files) {
      const design = await designRepository.create({
        title: path.parse(file.originalname).name,
        description: description || null,
        file_url: file.path,
        created_by,
        visibility: visibility || 'private',
      });
      const userDesign = await userDesignRepository.create({
        mnemonic_id: 'UDS' + uuidv4(),
        user_business_id,
        subscription_id,
        design_id: design.id,
      });
      results.push({ ...userDesign.toJSON(), design: design.toJSON() });
    }
    return results;
  }

  async getUserDesigns(filters = {}) {
    const userDesigns = await userDesignRepository.findAll(filters);
    return this._attachDesigns(userDesigns);
  }

  async getUserDesignsByBusiness(user_business_id) {
    const userDesigns = await userDesignRepository.findByUserBusinessId(user_business_id);
    return this._attachDesigns(userDesigns);
  }

  async getUserDesignByMnemonicId(mnemonic_id) {
    const userDesign = await userDesignRepository.findByMnemonicId(mnemonic_id);
    if (!userDesign) return null;
    const design = await designRepository.findById(userDesign.design_id);
    return { ...userDesign.toJSON(), design: design ? design.toJSON() : null };
  }

  async updateDesignMetadata(mnemonic_id, designData) {
    const userDesign = await userDesignRepository.findByMnemonicId(mnemonic_id);
    if (!userDesign) return null;
    await designRepository.update(userDesign.design_id, designData);
    return this.getUserDesignByMnemonicId(mnemonic_id);
  }

  async softDelete(mnemonic_id) {
    const userDesign = await userDesignRepository.findByMnemonicId(mnemonic_id);
    if (!userDesign) return null;
    // Soft-delete both the link and the design record
    await designRepository.update(userDesign.design_id, { is_deleted: true });
    return userDesignRepository.softDeleteByMnemonicId(mnemonic_id);
  }

  // Batch-fetch designs for a list of userDesign records (avoids N+1)
  async _attachDesigns(userDesigns) {
    if (!userDesigns.length) return [];
    const designIds = [...new Set(userDesigns.map(ud => ud.design_id))];
    const designs = await designRepository.findAll({ where: { id: designIds } });
    const designMap = Object.fromEntries(designs.map(d => [d.id, d.toJSON()]));
    return userDesigns.map(ud => ({ ...ud.toJSON(), design: designMap[ud.design_id] || null }));
  }
}

module.exports = new UserDesignService();
