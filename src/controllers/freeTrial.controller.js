const freeTrialService = require('../services/freeTrial.service');

exports.create = async (req, res, next) => {
  try {
    const freeTrial = await freeTrialService.createFreeTrial(req.body);
    res.status(201).json(freeTrial);
  } catch (err) { next(err); }
};

exports.getAll = async (req, res, next) => {
  try {
    const freeTrials = await freeTrialService.getAllFreeTrials();
    res.json(freeTrials);
  } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
  try {
    const freeTrial = await freeTrialService.getFreeTrialById(req.params.id);
    if (!freeTrial) return res.status(404).json({ error: 'FreeTrial not found' });
    res.json(freeTrial);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    await freeTrialService.updateFreeTrial(req.params.id, req.body);
    res.json({ message: 'FreeTrial updated' });
  } catch (err) { next(err); }
};

exports.delete = async (req, res, next) => {
  try {
    await freeTrialService.deleteFreeTrial(req.params.id);
    res.json({ message: 'FreeTrial deleted' });
  } catch (err) { next(err); }
};
