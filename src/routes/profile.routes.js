const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const {assetUpload} = require('../utils/multer.util');
const { updateProfileSchema, updateMobileSchema } = require('../validators/profile.validator');
const profileController = require('../controllers/profile.controller');

/**
 * @swagger
 * /profile:
 *   get:
 *     tags: [Profile]
 *     summary: Get the authenticated user's profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile object
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticate, profileController.getProfile);

/**
 * @swagger
 * /profile:
 *   put:
 *     tags: [Profile]
 *     summary: Update profile (supports optional file uploads for assets)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Optional asset files to upload
 *     responses:
 *       200:
 *         description: Updated profile
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 */
router.put('/', authenticate, validate(updateProfileSchema), assetUpload.array('files'), profileController.updateProfile);

/**
 * @swagger
 * /profile/mobile:
 *   put:
 *     tags: [Profile]
 *     summary: Update mobile number (OTP verification flow)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [mobile]
 *             properties:
 *               mobile:
 *                 type: string
 *                 example: "9876543210"
 *               otp:
 *                 type: string
 *                 description: Required in the verification step
 *               transaction_id:
 *                 type: string
 *                 description: Required in the verification step
 *     responses:
 *       200:
 *         description: Mobile updated or OTP sent
 *       400:
 *         description: Validation error
 */
router.put('/mobile', authenticate, validate(updateMobileSchema), profileController.updateMobile);

/**
 * @swagger
 * /profile/assets/{id}:
 *   delete:
 *     tags: [Profile]
 *     summary: Delete a user asset by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Asset ID to delete
 *     responses:
 *       200:
 *         description: Asset deleted
 *       404:
 *         description: Asset not found
 */
router.delete('/assets/:id', authenticate, profileController.deleteUserAsset);

module.exports = router;
