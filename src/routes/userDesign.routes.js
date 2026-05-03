const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/rbac.middleware');
const validate = require('../middlewares/validate.middleware');
const {upload} = require('../utils/multer.util');
const { createUserDesignSchema, updateUserDesignSchema, listQuerySchema } = require('../validators/userDesign.validator');
const controller = require('../controllers/userDesign.controller');

// All routes require authentication
router.use(authenticate);

router.get(
  '/',
  validate(listQuerySchema, 'query'),
  controller.getAll
);

router.post(
  '/',
  authorize('ADMIN', 'DESIGNER'),
  upload.array('files'),
  validate(createUserDesignSchema),
  controller.create
);

router.get('/:id', controller.getById);

router.put(
  '/:id',
  authorize('ADMIN', 'DESIGNER'),
  validate(updateUserDesignSchema),
  controller.update
);

router.delete(
  '/:id',
  authorize('ADMIN', 'DESIGNER'),
  controller.remove
);

router.get('/:id/file', controller.serveFile);

module.exports = router;
