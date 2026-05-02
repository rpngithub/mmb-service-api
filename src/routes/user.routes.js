const express = require('express');
const controller = require('../controllers/user.controller');
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/rbac.middleware');
const validate = require('../middlewares/validate.middleware');
const userValidator = require('../validators/user.validator');

const router = express.Router();

router.post('/', authenticate, authorize('ADMIN'), validate(userValidator.createUser), controller.create);
router.get('/', authenticate, authorize('ADMIN', 'CUSTOMER_SUPPORT'), controller.getAll);
router.get('/:id', authenticate, authorize('ADMIN', 'CUSTOMER_SUPPORT'), controller.getById);
router.put('/:id', authenticate, authorize('ADMIN', 'CUSTOMER_SUPPORT'), validate(userValidator.updateUser), controller.update);
router.delete('/:id', authenticate, authorize('ADMIN'), controller.delete);

module.exports = router;
