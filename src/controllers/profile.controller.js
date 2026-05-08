const userService = require('../services/user.service');
const userBusinessService = require('../services/userBusiness.service');
const subscriptionService = require('../services/subscription.service');
const userOtpService = require('../services/userOtp.service');
const userAssetsService = require('../services/userAssets.service');
const otpGenerator = require('../utils/otp.util');
const freeTrialService = require('../services/freeTrial.service');
const businessService = require('../services/business.service');
const planService = require('../services/plan.service');

exports.getProfile = async (req, res, next) => {
  try {
    const user = await userService.getUserByMnemonicId(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const response = { user };

    if (user.role === 'USER') {
      
      const userBusiness = await userBusinessService.getUserBusinessByUserId(user.id);
      // need to get business details for frontend to determine if "Other" and display user_business_other
      if (userBusiness && userBusiness.business_id  !== null && userBusiness.business_id !== -1) {
        const businessDetails = await businessService.getBusinessById(userBusiness.business_id);
        response.userBusiness = {
          ...userBusiness.toJSON(),
          business_name: businessDetails ? businessDetails.name : null,
        };
      } else {
        response.userBusiness = userBusiness;
      }
      const subscription = await subscriptionService.getActiveSubscriptionByUserId(user.id);
      if (subscription) {
        const plan = await planService.getPlanById(subscription.plan_id);
        response.subscription = {
          ...subscription.toJSON(),
          plan_name: plan ? plan.name : null,
        };
      } else {
        response.subscription = null;
      }

      response.freeTrial = await freeTrialService.getActiveFreeTrialByUserId(user.id);
    }

    response.userAssets = await userAssetsService.getAssetsByUserId(user.id);

    res.json(response);
  } catch (err) { next(err); }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const user = await userService.getUserByMnemonicId(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    console.log('Received updateProfile request with body:', req.body);

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
      if (userBusiness.business_id === -1 && !userBusiness.business_other) {
        return res.status(400).json({ error: 'Please provide a value for "Other" business' });
      }
      // remove business_id if it's -1 (indicating 'Other') to avoid foreign key issues
      if (userBusiness.business_id === -1) {
        userBusiness.business_id = null;
      }
      await userBusinessService.upsertUserBusiness(user.id, userBusiness);
    }

    if (req.files && req.files.length > 0) {
      await userAssetsService.createBulk(user.id, req.files.map(f => f.path));
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
      // return res.json({ transaction_id: otpRecord.transaction_id });
      return res.json({ transaction_id: otpRecord.transaction_id, otp: generatedOtp }); // return OTP in response for testing, should be removed in production
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

exports.deleteUserAsset = async (req, res, next) => {
  try {
    const user = await userService.getUserByMnemonicId(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    await userAssetsService.deleteAsset(Number(req.params.id), user.id);
    res.json({ message: 'Asset deleted' });
  } catch (err) {
    if (err.status === 403) return res.status(403).json({ error: err.message });
    if (err.status === 404) return res.status(404).json({ error: err.message });
    next(err);
  }
};
