const userBusinessService = require('../services/userBusiness.service');

exports.create = async (req, res, next) => {
  try {
    const userBusiness = await userBusinessService.createUserBusiness(req.body);
    res.status(201).json(userBusiness);
  } catch (err) { next(err); }
};

exports.getAll = async (req, res, next) => {
  try {
    const userBusinesses = await userBusinessService.getAllUserBusinesses();
    res.json(userBusinesses);
  } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
  try {
    const userBusiness = await userBusinessService.getUserBusinessById(req.params.id);
    if (!userBusiness) return res.status(404).json({ error: 'UserBusiness not found' });
    res.json(userBusiness);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    await userBusinessService.updateUserBusiness(req.params.id, req.body);
    res.json({ message: 'UserBusiness updated' });
  } catch (err) { next(err); }
};

exports.delete = async (req, res, next) => {
  try {
    await userBusinessService.deleteUserBusiness(req.params.id);
    res.json({ message: 'UserBusiness deleted' });
  } catch (err) { next(err); }
};
