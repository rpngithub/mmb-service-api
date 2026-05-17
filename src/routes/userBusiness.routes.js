const express = require('express');
const controller = require('../controllers/userBusiness.controller');
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/rbac.middleware');
const validate = require('../middlewares/validate.middleware');
const userBusinessValidator = require('../validators/userBusiness.validator');

const router = express.Router();

/**
 * @swagger
 * /user-businesses:
 *   post:
 *     tags: [User Businesses]
 *     summary: Associate a user with a business type (Admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [user_id, business_id]
 *             properties:
 *               user_id:
 *                 type: string
 *               business_id:
 *                 type: string
 *     responses:
 *       201:
 *         description: Association created
 *       403:
 *         description: Forbidden — Admin role required
 */
router.post('/', authenticate, authorize('ADMIN'), validate(userBusinessValidator.createUserBusiness), controller.create);

/**
 * @swagger
 * /user-businesses:
 *   get:
 *     tags: [User Businesses]
 *     summary: Get all user-business associations (Admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of associations
 *       403:
 *         description: Forbidden
 */
router.get('/', authenticate, authorize('ADMIN'), controller.getAll);

/**
 * @swagger
 * /user-businesses/{id}:
 *   get:
 *     tags: [User Businesses]
 *     summary: Get a user-business association by ID
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
 *         description: Association object
 *       404:
 *         description: Not found
 */
router.get('/:id', authenticate, controller.getById);

/**
 * @swagger
 * /user-businesses/{id}:
 *   put:
 *     tags: [User Businesses]
 *     summary: Update a user-business association (Admin only)
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
 *               user_id:
 *                 type: string
 *               business_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated association
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 */
router.put('/:id', authenticate, authorize('ADMIN'), validate(userBusinessValidator.updateUserBusiness), controller.update);

/**
 * @swagger
 * /user-businesses/{id}:
 *   delete:
 *     tags: [User Businesses]
 *     summary: Delete a user-business association (Admin only)
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
 *         description: Association deleted
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 */
router.delete('/:id', authenticate, authorize('ADMIN'), controller.delete);

module.exports = router;
