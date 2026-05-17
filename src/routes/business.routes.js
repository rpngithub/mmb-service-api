const express = require('express');
const controller = require('../controllers/business.controller');
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/rbac.middleware');
const validate = require('../middlewares/validate.middleware');
const businessValidator = require('../validators/business.validator');

const router = express.Router();

/**
 * @swagger
 * /businesses:
 *   get:
 *     tags: [Businesses]
 *     summary: Get all active business types (public)
 *     responses:
 *       200:
 *         description: List of active businesses
 */
router.get('/', controller.getActive);

/**
 * @swagger
 * /businesses/all:
 *   get:
 *     tags: [Businesses]
 *     summary: Get all business types including inactive (Admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all businesses
 *       403:
 *         description: Forbidden — Admin role required
 */
router.get('/all', authenticate, authorize('ADMIN'), controller.getAll);

/**
 * @swagger
 * /businesses:
 *   post:
 *     tags: [Businesses]
 *     summary: Create a new business type (Admin only)
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
 *                 example: Restaurant
 *               description:
 *                 type: string
 *               is_active:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Business type created
 *       403:
 *         description: Forbidden
 */
router.post('/', authenticate, authorize('ADMIN'), validate(businessValidator.createBusiness), controller.create);

/**
 * @swagger
 * /businesses/{id}:
 *   get:
 *     tags: [Businesses]
 *     summary: Get a business type by ID
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
 *         description: Business object
 *       404:
 *         description: Not found
 */
router.get('/:id', authenticate, controller.getById);

/**
 * @swagger
 * /businesses/{id}:
 *   put:
 *     tags: [Businesses]
 *     summary: Update a business type (Admin only)
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
 *               is_active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Updated business
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 */
router.put('/:id', authenticate, authorize('ADMIN'), validate(businessValidator.updateBusiness), controller.update);

/**
 * @swagger
 * /businesses/{id}:
 *   delete:
 *     tags: [Businesses]
 *     summary: Delete a business type (Admin only)
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
 *         description: Business deleted
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 */
router.delete('/:id', authenticate, authorize('ADMIN'), controller.delete);

module.exports = router;
