const userOtpService = require('../services/userOtp.service');
const otpGenerator = require('../utils/otp.util');

exports.requestOtp = async (req, res, next) => {
    try {
        const { send_to } = req.body; // mobile number to which OTP will be sent, can be changed based on requirements (e.g., email)
        const otp = otpGenerator.generateOTP();
        const otpData = await userOtpService.createOtp(otp, send_to);
        const sendResult = await otpGenerator.sendOTP(send_to, otp);
        res.json({ message: 'OTP sent successfully', transaction_id: otpData.transaction_id }); // In production, you would not send OTP back in response. This is just for testing purposes.
    } catch (err) {
        next(err);
    }
};

exports.verifyOtp = async (req, res, next) => {
    try {
        const { mobile, transaction_id, otp } = req.body;
        const result = await userOtpService.verifyOtp(transaction_id, otp, mobile);
        if (!result.valid) {
            let errorMessage = 'Invalid OTP';
            switch (result.reason) {
                case 'not_found':
                    errorMessage = 'OTP transaction not found';
                    break;
                case 'already_verified':
                    errorMessage = 'OTP already verified';
                    break;
                case 'expired':
                    errorMessage = 'OTP has expired';
                    break;
                case 'max_attempts':
                    errorMessage = 'Maximum OTP attempts exceeded';
                    break;
                case 'invalid_send_to':
                    errorMessage = 'Mobile mismatch for OTP transaction';
                    break;
            }
            return res.status(400).json({ error: errorMessage });
        }
        res.json({ message: 'OTP verified successfully' });
    } catch (err) {
        next(err);
    }
};