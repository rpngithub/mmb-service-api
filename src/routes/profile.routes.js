const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const {assetUpload} = require('../utils/multer.util');
const { updateProfileSchema, updateMobileSchema } = require('../validators/profile.validator');
const profileController = require('../controllers/profile.controller');

router.get('/', authenticate, profileController.getProfile);
router.put('/', authenticate, validate(updateProfileSchema), assetUpload.array('files'), profileController.updateProfile);
router.put('/mobile', authenticate, validate(updateMobileSchema), profileController.updateMobile);
router.delete('/assets/:id', authenticate, profileController.deleteUserAsset);

module.exports = router;
