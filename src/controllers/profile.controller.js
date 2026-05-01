const userService = require('../services/user.service');
const userBusinessService = require('../services/userBusiness.service');
const subscriptionService = require('../services/subscription.service');
const userOtpService = require('../services/userOtp.service');
const otpGenerator = require('../utils/otp.util');

exports.getProfile = async (req, res, next) => {
  try {
    const user = await userService.getUserByMnemonicId(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const response = { user };

    if (user.role === 'USER') {
      response.userBusiness = await userBusinessService.getUserBusinessByUserId(user.id);
      response.subscription = await subscriptionService.getActiveSubscriptionByUserId(user.id);
    }

    res.json(response);
  } catch (err) { next(err); }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const user = await userService.getUserByMnemonicId(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const { userBusiness, ...userFields } = req.body;

    // mobile is not allowed in this endpoint
    delete userFields.mobile;

    // check if email is being updated and if it's already in use
    if (userFields.email && userFields.email !== user.email) {
      const existing = await userService.getUserByEmail(userFields.email);
      if (existing) return res.status(400).json({ error: 'Email already in use' });
    }

    if (Object.keys(userFields).length > 0) {
      await userService.updateUser(user.id, userFields);
    }

    if (userBusiness && Object.keys(userBusiness).length > 0) {
      await userBusinessService.upsertUserBusiness(user.id, userBusiness);
    }

    res.json({ message: 'Profile updated' });
  } catch (err) { next(err); }
};

exports.updateMobile = async (req, res, next) => {
  try {
    const { mobile, transaction_id, otp } = req.body;

    if (!transaction_id) {
      // Step 1: initiate — check availability and send OTP
      const existing = await userService.getUserByMobile(mobile);
      if (existing) return res.status(400).json({ error: 'Mobile already in use' });

      const generatedOtp = otpGenerator.generateOTP();
      const otpRecord = await userOtpService.createOtp(generatedOtp, mobile, 10);
      return res.json({ transaction_id: otpRecord.transaction_id });
    }

    // Step 2: verify OTP and update mobile
    const result = await userOtpService.verifyOtp(transaction_id, otp, mobile);
    if (!result.valid) {
      const messages = {
        not_found: 'OTP transaction not found',
        already_verified: 'OTP already verified',
        expired: 'OTP has expired',
        max_attempts: 'Maximum OTP attempts exceeded',
        invalid_send_to: 'Mobile mismatch for OTP transaction',
      };
      return res.status(400).json({ error: messages[result.reason] || 'Invalid OTP' });
    }

    const user = await userService.getUserByMnemonicId(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    await userService.updateUser(user.id, { mobile, mobile_verified: true });
    res.json({ message: 'Mobile updated' });
  } catch (err) { next(err); }
};
