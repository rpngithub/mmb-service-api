const businessService = require('../services/business.service');

exports.create = async (req, res, next) => {
  try {
    const business = await businessService.createBusiness(req.body);
    res.status(201).json(business);
  } catch (err) { next(err); }
};

exports.getActive = async (req, res, next) => {
  try {
    const businesses = await businessService.getActiveBusinesses();
    res.json(businesses);
  } catch (err) { next(err); }
};

exports.getAll = async (req, res, next) => {
  try {
    const businesses = await businessService.getAllBusinesses();
    res.json(businesses);
  } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
  try {
    const business = await businessService.getBusinessById(req.params.id);
    if (!business) return res.status(404).json({ error: 'Business not found' });
    res.json(business);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    await businessService.updateBusiness(req.params.id, req.body);
    res.json({ message: 'Business updated' });
  } catch (err) { next(err); }
};

exports.delete = async (req, res, next) => {
  try {
    await businessService.deleteBusiness(req.params.id);
    res.json({ message: 'Business deleted' });
  } catch (err) { next(err); }
};
