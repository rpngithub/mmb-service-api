const express = require('express');
const controller = require('../controllers/subscription.controller');
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/rbac.middleware');
const validate = require('../middlewares/validate.middleware');
const subscriptionValidator = require('../validators/subscription.validator');

const router = express.Router();

/**
 * @swagger
 * /subscriptions/free-trial:
 *   post:
 *     tags: [Subscriptions]
 *     summary: Activate free trial for the authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Free trial activated
 *       400:
 *         description: User already has an active subscription or trial
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 */
router.post('/free-trial', authenticate, controller.activateFreeTrial);

/**
 * @swagger
 * /subscriptions/checkout:
 *   post:
 *     tags: [Subscriptions]
 *     summary: Initiate a payment checkout for a plan
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [plan_id]
 *             properties:
 *               plan_id:
 *                 type: string
 *                 description: ID of the plan to subscribe to
 *               plan_duration_unit:
 *                 type: string
 *                 enum: [monthly, yearly]
 *                 description: Billing period (defaults to monthly)
 *     responses:
 *       200:
 *         description: Checkout order created; use returned order details with Razorpay
 *       400:
 *         description: Invalid plan or validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/checkout', authenticate, validate(subscriptionValidator.checkout), controller.checkout);

/**
 * @swagger
 * /subscriptions/verify-payment:
 *   post:
 *     tags: [Subscriptions]
 *     summary: Verify Razorpay payment and activate subscription
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [razorpay_order_id, razorpay_payment_id, razorpay_signature]
 *             properties:
 *               razorpay_order_id:
 *                 type: string
 *               razorpay_payment_id:
 *                 type: string
 *               razorpay_signature:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment verified and subscription activated
 *       400:
 *         description: Payment verification failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/verify-payment', authenticate, validate(subscriptionValidator.verifyPayment), controller.verifyPayment);

/**
 * @swagger
 * /subscriptions:
 *   post:
 *     tags: [Subscriptions]
 *     summary: Manually create a subscription (Admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [user_id, plan_id]
 *             properties:
 *               user_id:
 *                 type: string
 *               plan_id:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [active, inactive, expired, cancelled]
 *               start_date:
 *                 type: string
 *                 format: date
 *               end_date:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Subscription created
 *       403:
 *         description: Forbidden — Admin role required
 */
router.post('/', authenticate, authorize('ADMIN'), validate(subscriptionValidator.createSubscription), controller.create);

/**
 * @swagger
 * /subscriptions:
 *   get:
 *     tags: [Subscriptions]
 *     summary: Get all subscriptions (Admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all subscriptions
 *       403:
 *         description: Forbidden
 */
router.get('/', authenticate, authorize('ADMIN'), controller.getAll);

/**
 * @swagger
 * /subscriptions/{id}:
 *   get:
 *     tags: [Subscriptions]
 *     summary: Get a subscription by ID
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
 *         description: Subscription object
 *       404:
 *         description: Subscription not found
 */
router.get('/:id', authenticate, controller.getById);

/**
 * @swagger
 * /subscriptions/{id}:
 *   put:
 *     tags: [Subscriptions]
 *     summary: Update a subscription (Admin only)
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
 *               status:
 *                 type: string
 *                 enum: [active, inactive, expired, cancelled]
 *               end_date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Updated subscription
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 */
router.put('/:id', authenticate, authorize('ADMIN'), validate(subscriptionValidator.updateSubscription), controller.update);

/**
 * @swagger
 * /subscriptions/{id}:
 *   delete:
 *     tags: [Subscriptions]
 *     summary: Delete a subscription (Admin only)
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
 *         description: Subscription deleted
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 */
router.delete('/:id', authenticate, authorize('ADMIN'), controller.delete);

module.exports = router;
