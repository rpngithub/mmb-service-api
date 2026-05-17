const express = require('express');
const controller = require('../controllers/design.controller');
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/rbac.middleware');
const validate = require('../middlewares/validate.middleware');
const designValidator = require('../validators/design.validator');

const router = express.Router();

/**
 * @swagger
 * /designs:
 *   post:
 *     tags: [Designs]
 *     summary: Create a new design (Admin / Designer only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               thumbnail_url:
 *                 type: string
 *               is_active:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Design created
 *       403:
 *         description: Forbidden — Admin or Designer role required
 */
router.post('/', authenticate, authorize('ADMIN', 'DESIGNER'), validate(designValidator.createDesign), controller.create);

/**
 * @swagger
 * /designs:
 *   get:
 *     tags: [Designs]
 *     summary: Get all designs (Admin / Designer only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of designs
 *       403:
 *         description: Forbidden
 */
router.get('/', authenticate, authorize('ADMIN', 'DESIGNER'), controller.getAll);

/**
 * @swagger
 * /designs/{id}:
 *   get:
 *     tags: [Designs]
 *     summary: Get a design by ID
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
 *         description: Design object
 *       404:
 *         description: Design not found
 */
router.get('/:id', authenticate, controller.getById);

/**
 * @swagger
 * /designs/{id}:
 *   put:
 *     tags: [Designs]
 *     summary: Update a design (Admin / Designer only)
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
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               thumbnail_url:
 *                 type: string
 *               is_active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Updated design
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 */
router.put('/:id', authenticate, authorize('ADMIN', 'DESIGNER'), validate(designValidator.updateDesign), controller.update);

/**
 * @swagger
 * /designs/{id}:
 *   delete:
 *     tags: [Designs]
 *     summary: Delete a design (Admin only)
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
 *         description: Design deleted
 *       403:
 *         description: Forbidden — Admin role required
 *       404:
 *         description: Not found
 */
router.delete('/:id', authenticate, authorize('ADMIN'), controller.delete);

module.exports = router;
