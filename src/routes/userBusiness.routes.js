const express = require('express');
const controller = require('../controllers/userBusiness.controller');
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/rbac.middleware');
const validate = require('../middlewares/validate.middleware');
const userBusinessValidator = require('../validators/userBusiness.validator');

const router = express.Router();

router.post('/', authenticate, authorize('ADMIN'), validate(userBusinessValidator.createUserBusiness), controller.create);
router.get('/', authenticate, authorize('ADMIN'), controller.getAll);
router.get('/:id', authenticate, controller.getById);
router.put('/:id', authenticate, authorize('ADMIN'), validate(userBusinessValidator.updateUserBusiness), controller.update);
router.delete('/:id', authenticate, authorize('ADMIN'), controller.delete);

module.exports = router;
