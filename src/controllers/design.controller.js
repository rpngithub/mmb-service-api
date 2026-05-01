const designService = require('../services/design.service');

exports.create = async (req, res, next) => {
  try {
    const design = await designService.createDesign(req.body);
    res.status(201).json(design);
  } catch (err) { next(err); }
};

exports.getAll = async (req, res, next) => {
  try {
    const designs = await designService.getAllDesigns();
    res.json(designs);
  } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
  try {
    const design = await designService.getDesignById(req.params.id);
    if (!design) return res.status(404).json({ error: 'Design not found' });
    res.json(design);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    await designService.updateDesign(req.params.id, req.body);
    res.json({ message: 'Design updated' });
  } catch (err) { next(err); }
};

exports.delete = async (req, res, next) => {
  try {
    await designService.deleteDesign(req.params.id);
    res.json({ message: 'Design deleted' });
  } catch (err) { next(err); }
};
