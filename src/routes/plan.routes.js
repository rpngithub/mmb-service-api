const express = require('express');
const controller = require('../controllers/plan.controller');
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/rbac.middleware');
const validate = require('../middlewares/validate.middleware');
const planValidator = require('../validators/plan.validator');

const router = express.Router();

router.get('/', controller.getActive);
router.get('/all', authenticate, authorize('ADMIN'), controller.getAll);
router.post('/', authenticate, authorize('ADMIN'), validate(planValidator.createPlan), controller.create);
router.get('/:id', authenticate, controller.getById);
router.put('/:id', authenticate, authorize('ADMIN'), validate(planValidator.updatePlan), controller.update);
router.delete('/:id', authenticate, authorize('ADMIN'), controller.delete);

module.exports = router;
