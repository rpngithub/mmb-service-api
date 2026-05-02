const planService = require('../services/plan.service');

exports.create = async (req, res, next) => {
  try {
    const plan = await planService.createPlan(req.body);
    res.status(201).json(plan);
  } catch (err) { next(err); }
};

exports.getActive = async (req, res, next) => {
  try {
    const plans = await planService.getActivePlans();
    res.json(plans);
  } catch (err) { next(err); }
};

exports.getAll = async (req, res, next) => {
  try {
    const plans = await planService.getAllPlans();
    res.json(plans);
  } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
  try {
    const plan = await planService.getPlanById(req.params.id);
    if (!plan) return res.status(404).json({ error: 'Plan not found' });
    res.json(plan);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    await planService.updatePlan(req.params.id, req.body);
    res.json({ message: 'Plan updated' });
  } catch (err) { next(err); }
};

exports.delete = async (req, res, next) => {
  try {
    await planService.deletePlan(req.params.id);
    res.json({ message: 'Plan deleted' });
  } catch (err) { next(err); }
};
