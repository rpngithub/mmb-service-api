const express = require('express');
const router = express.Router();
const validate = require('../middlewares/validate.middleware');
const { signupSchema, signinSchema, signinMobileSchema, verifyOtpSchema, requestOtpSchema } = require('../validators/auth.validator');
const authController = require('../controllers/auth.controller');
const otpController = require('../controllers/otp.controller');
const authenticate = require('../middlewares/auth.middleware');
const authLimiter = require('../middlewares/authLimit.middleware');

router.post('/signup', authLimiter, validate(signupSchema), authController.signup, authController.completeSignIn);
router.post('/signin', validate(signinSchema), authController.signin, authController.completeSignIn);
router.post('/signin-mobile', authLimiter, validate(signinMobileSchema), authController.signinMobile, authController.completeSignIn);
router.post('/refresh', authController.refreshToken);
router.post('/logout', authenticate, authController.logout);
// we will check if we need these endpoints later, for now we will handle OTP within the signup/signin flows
// router.post('/request-otp', validate(requestOtpSchema), otpController.requestOtp);
// router.post('/verify-otp', validate(verifyOtpSchema), otpController.verifyOtp);

module.exports = router;
