const express = require('express');
const controller = require('../controllers/plan.controller');
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/rbac.middleware');
const validate = require('../middlewares/validate.middleware');
const planValidator = require('../validators/plan.validator');

const router = express.Router();

/**
 * @swagger
 * /plans:
 *   get:
 *     tags: [Plans]
 *     summary: Get all active plans (public)
 *     responses:
 *       200:
 *         description: List of active plans
 */
router.get('/', controller.getActive);

/**
 * @swagger
 * /plans/all:
 *   get:
 *     tags: [Plans]
 *     summary: Get all plans including inactive (Admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all plans
 *       403:
 *         description: Forbidden — Admin role required
 */
router.get('/all', authenticate, authorize('ADMIN'), controller.getAll);

/**
 * @swagger
 * /plans:
 *   post:
 *     tags: [Plans]
 *     summary: Create a new plan (Admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, price]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Pro Plan
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *                 example: 999
 *               duration_days:
 *                 type: integer
 *                 example: 30
 *               is_active:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Plan created
 *       403:
 *         description: Forbidden
 */
router.post('/', authenticate, authorize('ADMIN'), validate(planValidator.createPlan), controller.create);

/**
 * @swagger
 * /plans/{id}:
 *   get:
 *     tags: [Plans]
 *     summary: Get a plan by ID
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
 *         description: Plan object
 *       404:
 *         description: Plan not found
 */
router.get('/:id', authenticate, controller.getById);

/**
 * @swagger
 * /plans/{id}:
 *   put:
 *     tags: [Plans]
 *     summary: Update a plan (Admin only)
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
 *               price:
 *                 type: number
 *               duration_days:
 *                 type: integer
 *               is_active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Updated plan
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Plan not found
 */
router.put('/:id', authenticate, authorize('ADMIN'), validate(planValidator.updatePlan), controller.update);

/**
 * @swagger
 * /plans/{id}:
 *   delete:
 *     tags: [Plans]
 *     summary: Delete a plan (Admin only)
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
 *         description: Plan deleted
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Plan not found
 */
router.delete('/:id', authenticate, authorize('ADMIN'), controller.delete);

module.exports = router;
