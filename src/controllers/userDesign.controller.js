const path = require('path');
const fs = require('fs');
const User = require('../models/user.model');
const userDesignService = require('../services/userDesign.service');
const userBusinessService = require('../services/userBusiness.service');
const subscriptionService = require('../services/subscription.service');

// GET /user-designs/
// USER role → own business designs only. ADMIN/DESIGNER → all, with optional query filters.
exports.getAll = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { mnemonic_id: req.user.id } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (user.role === 'USER') {
      const userBusiness = await userBusinessService.getUserBusinessByUserId(user.id);
      if (!userBusiness) return res.json([]);
      const designs = await userDesignService.getUserDesignsByBusiness(userBusiness.id);
      return res.json(designs);
    }

    // ADMIN / DESIGNER: honour query filters
    const filters = {};
    if (req.query.user_business_id) filters.user_business_id = Number(req.query.user_business_id);
    if (req.query.subscription_id) filters.subscription_id = Number(req.query.subscription_id);
    const designs = await userDesignService.getUserDesigns(filters);
    res.json(designs);
  } catch (err) { next(err); }
};

// POST /user-designs/  (ADMIN / DESIGNER only — enforced by authorize middleware)
exports.create = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'At least one file is required' });
    }

    const { user_business_id, description, visibility } = req.body;

    const userBusiness = await userBusinessService.getUserBusinessById(user_business_id);
    if (!userBusiness) return res.status(404).json({ error: 'UserBusiness not found' });

    const subscription = await subscriptionService.getActiveSubscriptionByUserId(userBusiness.user_id);
    if (!subscription) return res.status(400).json({ error: 'No active subscription found for this business' });

    const results = await userDesignService.createFromFiles(req.files, {
      user_business_id: userBusiness.id,
      subscription_id: subscription.id,
      created_by: req.dbUser.id,
      description,
      visibility,
    });
    res.status(201).json(results);
  } catch (err) { next(err); }
};

// GET /user-designs/:id
exports.getById = async (req, res, next) => {
  try {
    const userDesign = await userDesignService.getUserDesignByMnemonicId(req.params.id);
    if (!userDesign) return res.status(404).json({ error: 'UserDesign not found' });
    res.json(userDesign);
  } catch (err) { next(err); }
};

// PUT /user-designs/:id  — update design title, description, visibility (ADMIN / DESIGNER only)
exports.update = async (req, res, next) => {
  try {
    const updated = await userDesignService.updateDesignMetadata(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'UserDesign not found' });
    res.json(updated);
  } catch (err) { next(err); }
};

// DELETE /user-designs/:id  (ADMIN / DESIGNER only)
exports.remove = async (req, res, next) => {
  try {
    const result = await userDesignService.softDelete(req.params.id);
    if (!result) return res.status(404).json({ error: 'UserDesign not found' });
    res.json({ message: 'Design deleted' });
  } catch (err) { next(err); }
};

// GET /user-designs/:id/file  — stream file to client
exports.serveFile = async (req, res, next) => {
  try {
    const userDesign = await userDesignService.getUserDesignByMnemonicId(req.params.id);
    if (!userDesign || !userDesign.design) return res.status(404).json({ error: 'UserDesign not found' });

    const filePath = path.resolve(userDesign.design.file_url);
    if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File not found on server' });

    res.download(filePath, path.basename(filePath));
  } catch (err) { next(err); }
};
