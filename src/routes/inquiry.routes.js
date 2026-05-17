const express = require('express');
const controller = require('../controllers/inquiry.controller');
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/rbac.middleware');
const validate = require('../middlewares/validate.middleware');
const inquiryValidator = require('../validators/inquiry.validator');

const router = express.Router();

router.post('/', validate(inquiryValidator.submit), controller.submit);
router.get('/', authenticate, authorize(['ADMIN','CUSTOMER_SUPPORT']), controller.list);
router.patch('/:id/status', authenticate, authorize(['ADMIN','CUSTOMER_SUPPORT']), validate(inquiryValidator.updateStatus), controller.updateStatus);

module.exports = router;
