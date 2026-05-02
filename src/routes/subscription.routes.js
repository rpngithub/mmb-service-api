const express = require('express');
const controller = require('../controllers/subscription.controller');
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/rbac.middleware');
const validate = require('../middlewares/validate.middleware');
const subscriptionValidator = require('../validators/subscription.validator');

const router = express.Router();

router.post('/free-trial', authenticate, controller.activateFreeTrial);
router.post('/checkout', authenticate, validate(subscriptionValidator.checkout), controller.checkout);
router.post('/verify-payment', authenticate, validate(subscriptionValidator.verifyPayment), controller.verifyPayment);

router.post('/', authenticate, authorize('ADMIN'), validate(subscriptionValidator.createSubscription), controller.create);
router.get('/', authenticate, authorize('ADMIN'), controller.getAll);
router.get('/:id', authenticate, controller.getById);
router.put('/:id', authenticate, authorize('ADMIN'), validate(subscriptionValidator.updateSubscription), controller.update);
router.delete('/:id', authenticate, authorize('ADMIN'), controller.delete);

module.exports = router;
