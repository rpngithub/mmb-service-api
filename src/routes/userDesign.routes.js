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

/**
 * @swagger
 * /user-designs:
 *   get:
 *     tags: [User Designs]
 *     summary: Get all user designs with optional filters
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: string
 *         description: Filter by user ID
 *       - in: query
 *         name: design_id
 *         schema:
 *           type: string
 *         description: Filter by design ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by status
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Paginated list of user designs
 */
router.get(
  '/',
  validate(listQuerySchema, 'query'),
  controller.getAll
);

/**
 * @swagger
 * /user-designs:
 *   post:
 *     tags: [User Designs]
 *     summary: Create a user design with file uploads (Admin / Designer only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [user_id, design_id]
 *             properties:
 *               user_id:
 *                 type: string
 *               design_id:
 *                 type: string
 *               notes:
 *                 type: string
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Design files to upload
 *     responses:
 *       201:
 *         description: User design created
 *       403:
 *         description: Forbidden — Admin or Designer role required
 */
router.post(
  '/',
  authorize('ADMIN', 'DESIGNER'),
  upload.array('files'),
  validate(createUserDesignSchema),
  controller.create
);

/**
 * @swagger
 * /user-designs/{id}:
 *   get:
 *     tags: [User Designs]
 *     summary: Get a user design by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User design object
 *       404:
 *         description: Not found
 */
router.get('/:id', controller.getById);

/**
 * @swagger
 * /user-designs/{id}:
 *   put:
 *     tags: [User Designs]
 *     summary: Update a user design (Admin / Designer only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notes:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated user design
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 */
router.put(
  '/:id',
  authorize('ADMIN', 'DESIGNER'),
  validate(updateUserDesignSchema),
  controller.update
);

/**
 * @swagger
 * /user-designs/{id}:
 *   delete:
 *     tags: [User Designs]
 *     summary: Delete a user design (Admin / Designer only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User design deleted
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 */
router.delete(
  '/:id',
  authorize('ADMIN', 'DESIGNER'),
  controller.remove
);

/**
 * @swagger
 * /user-designs/{id}/file:
 *   get:
 *     tags: [User Designs]
 *     summary: Download / stream a design file
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User design ID whose file to serve
 *     responses:
 *       200:
 *         description: File stream
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: File not found
 */
router.get('/:id/file', controller.serveFile);

module.exports = router;
