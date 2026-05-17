const express = require('express');
const controller = require('../controllers/inquiry.controller');
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/rbac.middleware');
const validate = require('../middlewares/validate.middleware');
const inquiryValidator = require('../validators/inquiry.validator');

const router = express.Router();

/**
 * @swagger
 * /inquiries:
 *   post:
 *     tags: [Inquiries]
 *     summary: Submit a customer inquiry (public — no auth required)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, message]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Jane Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: jane@example.com
 *               mobile:
 *                 type: string
 *                 example: "9876543210"
 *               message:
 *                 type: string
 *                 example: I would like to know more about your plans.
 *     responses:
 *       201:
 *         description: Inquiry submitted
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', validate(inquiryValidator.submit), controller.submit);

/**
 * @swagger
 * /inquiries:
 *   get:
 *     tags: [Inquiries]
 *     summary: List inquiries (Admin / Customer Support only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [open, in_progress, resolved, closed]
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
 *         description: Paginated list of inquiries
 *       403:
 *         description: Forbidden
 */
router.get('/', authenticate, authorize(['ADMIN','CUSTOMER_SUPPORT']), controller.list);

/**
 * @swagger
 * /inquiries/{id}/status:
 *   patch:
 *     tags: [Inquiries]
 *     summary: Update the status of an inquiry (Admin / Customer Support only)
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
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [open, in_progress, resolved, closed]
 *     responses:
 *       200:
 *         description: Updated inquiry
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Inquiry not found
 */
router.patch('/:id/status', authenticate, authorize(['ADMIN','CUSTOMER_SUPPORT']), validate(inquiryValidator.updateStatus), controller.updateStatus);

module.exports = router;
