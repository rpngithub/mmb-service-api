const express = require('express');
const router = express.Router();
const validate = require('../middlewares/validate.middleware');
const { signupSchema, signinSchema, signinMobileSchema, verifyOtpSchema, requestOtpSchema } = require('../validators/auth.validator');
const authController = require('../controllers/auth.controller');
const otpController = require('../controllers/otp.controller');
const authenticate = require('../middlewares/auth.middleware');
const authLimiter = require('../middlewares/authLimit.middleware');

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user (Step 1 sends OTP, Step 2 verifies and returns token)
 *     description: |
 *       Two-step flow.
 *       - **Step 1**: Provide `name`, `email`, `mobile` → receives `user_id`, `transaction_id`, `otp` (dev only)
 *       - **Step 2**: Provide `user_id`, `transaction_id`, `otp` → receives `accessToken` (refresh token in httpOnly cookie)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - title: Step 1 — Request OTP
 *                 type: object
 *                 required: [name, email, mobile]
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: John Doe
 *                   email:
 *                     type: string
 *                     format: email
 *                     example: john@example.com
 *                   mobile:
 *                     type: string
 *                     example: "9876543210"
 *               - title: Step 2 — Verify OTP
 *                 type: object
 *                 required: [user_id, transaction_id, otp]
 *                 properties:
 *                   user_id:
 *                     type: string
 *                   transaction_id:
 *                     type: string
 *                   otp:
 *                     type: string
 *                     example: "123456"
 *     responses:
 *       200:
 *         description: OTP sent (Step 1) or access token returned (Step 2)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       429:
 *         description: Too many requests (rate limited)
 */
router.post('/signup', authLimiter, validate(signupSchema), authController.signup, authController.completeSignIn);

/**
 * @swagger
 * /auth/signin:
 *   post:
 *     tags: [Auth]
 *     summary: Sign in with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: secret123
 *     responses:
 *       200:
 *         description: Returns access token; refresh token set in httpOnly cookie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/signin', validate(signinSchema), authController.signin, authController.completeSignIn);

/**
 * @swagger
 * /auth/signin-mobile:
 *   post:
 *     tags: [Auth]
 *     summary: Sign in with mobile number via OTP (Step 1 sends OTP, Step 2 verifies)
 *     description: |
 *       Two-step flow.
 *       - **Step 1**: Provide `mobile` → receives `transaction_id`, `otp` (dev only)
 *       - **Step 2**: Provide `mobile`, `transaction_id`, `otp` → receives `accessToken`
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - title: Step 1 — Request OTP
 *                 type: object
 *                 required: [mobile]
 *                 properties:
 *                   mobile:
 *                     type: string
 *                     example: "9876543210"
 *               - title: Step 2 — Verify OTP
 *                 type: object
 *                 required: [mobile, transaction_id, otp]
 *                 properties:
 *                   mobile:
 *                     type: string
 *                   transaction_id:
 *                     type: string
 *                   otp:
 *                     type: string
 *                     example: "123456"
 *     responses:
 *       200:
 *         description: OTP sent (Step 1) or access token returned (Step 2)
 *       429:
 *         description: Too many requests (rate limited)
 */
router.post('/signin-mobile', authLimiter, validate(signinMobileSchema), authController.signinMobile, authController.completeSignIn);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     tags: [Auth]
 *     summary: Refresh access token using the httpOnly refresh token cookie
 *     responses:
 *       200:
 *         description: New access token issued
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *       401:
 *         description: Refresh token missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/refresh', authController.refreshToken);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Logout and invalidate the current access token
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logged out successfully
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/logout', authenticate, authController.logout);

// we will check if we need these endpoints later, for now we will handle OTP within the signup/signin flows
// router.post('/request-otp', validate(requestOtpSchema), otpController.requestOtp);
// router.post('/verify-otp', validate(verifyOtpSchema), otpController.verifyOtp);

module.exports = router;
