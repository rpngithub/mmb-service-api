const userOtpRepository = require('../repositories/userOtp.repository');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const userOtpService = {
    async createOtp(otp, send_to, expiresInMinutes = 10) {
        const transaction_id = uuidv4();
        const hashedOtp = await bcrypt.hash(otp, 10);
        const expiresAt = new Date(Date.now() + expiresInMinutes * 60000);
        return userOtpRepository.create({ transaction_id, send_to, otp: hashedOtp, expiresAt });
    },

    async verifyOtp(transaction_id, otp, send_to = null) {
        const userOtp = await userOtpRepository.findByTransactionId(transaction_id);
        if (!userOtp) return { valid: false, reason: 'not_found' };
        if (userOtp.verified) return { valid: false, reason: 'already_verified' };
        if (userOtp.expiresAt < new Date()) return { valid: false, reason: 'expired' };
        if (userOtp.attempts >= 5) return { valid: false, reason: 'max_attempts' };
        if (send_to && userOtp.send_to !== send_to) return { valid: false, reason: 'invalid_send_to' };

        const match = await bcrypt.compare(otp, userOtp.otp);
        if (!match) {
            await userOtpRepository.incrementAttempts(userOtp.id);
            return { valid: false, reason: 'invalid' };
        }
        await userOtpRepository.markVerified(userOtp.id);
        return { valid: true };
    },

    async getById(id) {
        return userOtpRepository.findById(id);
    },

    async deleteById(id) {
        return userOtpRepository.deleteById(id);
    },
};

module.exports = userOtpService;
