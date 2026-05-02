const express = require('express');
const controller = require('../controllers/business.controller');
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/rbac.middleware');
const validate = require('../middlewares/validate.middleware');
const businessValidator = require('../validators/business.validator');

const router = express.Router();

router.get('/', controller.getActive);
router.get('/all', authenticate, authorize('ADMIN'), controller.getAll);
router.post('/', authenticate, authorize('ADMIN'), validate(businessValidator.createBusiness), controller.create);
router.get('/:id', authenticate, controller.getById);
router.put('/:id', authenticate, authorize('ADMIN'), validate(businessValidator.updateBusiness), controller.update);
router.delete('/:id', authenticate, authorize('ADMIN'), controller.delete);

module.exports = router;
