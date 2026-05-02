const express = require('express');
const controller = require('../controllers/design.controller');
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/rbac.middleware');
const validate = require('../middlewares/validate.middleware');
const designValidator = require('../validators/design.validator');

const router = express.Router();

router.post('/', authenticate, authorize('ADMIN', 'DESIGNER'), validate(designValidator.createDesign), controller.create);
router.get('/', authenticate, authorize('ADMIN', 'DESIGNER'), controller.getAll);
router.get('/:id', authenticate, controller.getById);
router.put('/:id', authenticate, authorize('ADMIN', 'DESIGNER'), validate(designValidator.updateDesign), controller.update);
router.delete('/:id', authenticate, authorize('ADMIN'), controller.delete);

module.exports = router;
