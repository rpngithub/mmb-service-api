const express = require('express');
const controller = require('../controllers/user.controller');
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/rbac.middleware');
const validate = require('../middlewares/validate.middleware');
const userValidator = require('../validators/user.validator');

const router = express.Router();

/**
 * @swagger
 * /users:
 *   post:
 *     tags: [Users]
 *     summary: Create a new user (Admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, mobile, password]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               mobile:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [ADMIN, DESIGNER, CUSTOMER_SUPPORT, USER]
 *     responses:
 *       201:
 *         description: User created
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden — Admin role required
 */
router.post('/', authenticate, authorize('ADMIN'), validate(userValidator.createUser), controller.create);

/**
 * @swagger
 * /users:
 *   get:
 *     tags: [Users]
 *     summary: Get all users (Admin / Customer Support only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *       403:
 *         description: Forbidden
 */
router.get('/', authenticate, authorize('ADMIN', 'CUSTOMER_SUPPORT'), controller.getAll);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Get a user by ID (Admin / Customer Support only)
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
 *         description: User object
 *       404:
 *         description: User not found
 */
router.get('/:id', authenticate, authorize('ADMIN', 'CUSTOMER_SUPPORT'), controller.getById);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     tags: [Users]
 *     summary: Update a user (Admin / Customer Support only)
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
 *               email:
 *                 type: string
 *                 format: email
 *               mobile:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [ADMIN, DESIGNER, CUSTOMER_SUPPORT, USER]
 *     responses:
 *       200:
 *         description: Updated user
 *       404:
 *         description: User not found
 */
router.put('/:id', authenticate, authorize('ADMIN', 'CUSTOMER_SUPPORT'), validate(userValidator.updateUser), controller.update);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Delete a user (Admin only)
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
 *         description: User deleted
 *       403:
 *         description: Forbidden — Admin role required
 *       404:
 *         description: User not found
 */
router.delete('/:id', authenticate, authorize('ADMIN'), controller.delete);

module.exports = router;
