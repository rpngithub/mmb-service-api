const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt.util');
const tokenBlacklistService = require('../services/tokenBlacklist.service');
const User = require('../models/user.model');
const userService = require('../services/user.service');
const userOtpService = require('../services/userOtp.service');
const otpGenerator = require('../utils/otp.util');

const otpErrors = {
  not_found: 'OTP transaction not found',
  already_verified: 'OTP already verified',
  expired: 'OTP has expired',
  max_attempts: 'Maximum OTP attempts exceeded',
  invalid_send_to: 'Mobile mismatch for OTP transaction',
};

exports.signup = async (req, res, next) => {
  try {
    const { name, email, mobile, user_id, transaction_id, otp } = req.body;

    if (!transaction_id) {
      // Step 1: register and send OTP
      console.log(`Signup attempt for mobile: ${mobile}, email: ${email}`);
      let user = await userService.getUserByMobile(mobile);

      if (user) {
        console.log(`Existing user found for mobile ${mobile}:`, { id: user.mnemonic_id, email: user.email, is_active: user.is_active });
        // Mobile exists but user never completed OTP — allow retry
        if (user.is_active) return res.status(400).json({ error: 'Mobile number already registered' });
      } else {
        // Check email separately only when mobile is new
        console.log(`Checking email ${email} for new user registration`);
        const existingEmail = await userService.getUserByEmail(email);
        if (existingEmail && existingEmail.is_active) return res.status(400).json({ error: 'Email already registered' });

        user = await userService.registerUser({ name, email, mobile });
      }

      const generatedOtp = otpGenerator.generateOTP();
      const otpRecord = await userOtpService.createOtp(generatedOtp, mobile, 10);
      if (process.env.NODE_ENV === 'production') {
        console.log(`Sending OTP to ${mobile} for user ${user.mnemonic_id}`);
        const sendResult = await otpGenerator.sendOTP(mobile, generatedOtp);
        console.log('OTP send result:', sendResult);
        return res.status(201).json({ user_id: user.mnemonic_id, transaction_id: otpRecord.transaction_id });
      } else {
        console.log(`Generated OTP for ${mobile}: ${generatedOtp}`);
        return res.status(201).json({ user_id: user.mnemonic_id, transaction_id: otpRecord.transaction_id, otp: generatedOtp }); // Include OTP in response for testing purposes
      }
    }

    // Step 2: verify OTP, activate user, proceed to completeSignIn
    const user = await userService.getUserByMnemonicId(user_id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const result = await userOtpService.verifyOtp(transaction_id, otp, user.mobile);
    if (!result.valid) return res.status(400).json({ error: otpErrors[result.reason] || 'Invalid OTP' });

    await userService.updateUser(user.id, { is_active: true, mobile_verified: true });
    req.user = user;
    next();
  } catch (err) { next(err); }
};

exports.signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, user.password || '');
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    req.user = user;
    next();
  } catch (err) { next(err); }
};

exports.signinMobile = async (req, res, next) => {
  try {
    const { mobile, transaction_id, otp } = req.body;

    const user = await userService.getUserByMobile(mobile);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    if (!user.is_active) return res.status(401).json({ error: 'User account is not active' });
    if (!user.mobile_verified) return res.status(401).json({ error: 'Mobile number not verified' });

    if (!transaction_id) {
      // Step 1: send OTP
      const generatedOtp = otpGenerator.generateOTP();
      const otpRecord = await userOtpService.createOtp(generatedOtp, mobile, 10);
      if (process.env.NODE_ENV === 'production') {
        const sendResult = await otpGenerator.sendOTP(mobile, generatedOtp);
        console.log('OTP send result:', sendResult);
        return res.json({ transaction_id: otpRecord.transaction_id });
      } else {
        console.log(`Generated OTP for ${mobile}: ${generatedOtp}`);
        return res.json({ transaction_id: otpRecord.transaction_id, otp: generatedOtp });
      }
    }

    // Step 2: verify OTP, proceed to completeSignIn
    const result = await userOtpService.verifyOtp(transaction_id, otp, mobile);
    if (!result.valid) return res.status(400).json({ error: otpErrors[result.reason] || 'Invalid OTP' });

    req.user = user;
    next();
  } catch (err) { next(err); }
};

exports.completeSignIn = async (req, res, next) => {
  try {
    const user = req.user || await userService.getUserByMnemonicId(req.body.user_id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const payload = { id: user.mnemonic_id, email: user.email, mobile: user.mobile };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken });
  } catch (err) { next(err); }
};

exports.logout = async (req, res, next) => {
  try {
    const token = req.token;
    const decoded = jwt.decode(token);
    if (decoded && decoded.jti) {
      await tokenBlacklistService.blacklist(decoded.jti, new Date(decoded.exp * 1000));
    }
    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out successfully' });
  } catch (err) { next(err); }
};

exports.refreshToken = (req, res, next) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) return res.status(401).json({ error: 'No refresh token provided' });
  try {
    const payload = verifyRefreshToken(refreshToken);
    const accessToken = generateAccessToken({ id: payload.id, email: payload.email, mobile: payload.mobile });
    res.json({ accessToken });
  } catch (err) { next(err); }
};
