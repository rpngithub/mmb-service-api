const UserOtp = require('../models/userOtp.model');

const userOtpRepository = {
    async create(data) {
        return UserOtp.create(data);
    },
    async findById(id) {
        return UserOtp.findByPk(id);
    },
    async findByTransactionId(transaction_id) {
        return UserOtp.findOne({ where: { transaction_id } });
    },
    async updateById(id, updates) {
        return UserOtp.update(updates, { where: { id } });
    },
    async deleteById(id) {
        return UserOtp.destroy({ where: { id } });
    },
    async incrementAttempts(id) {
        return UserOtp.increment('attempts', { by: 1, where: { id } });
    },
    async markVerified(id) {
        return UserOtp.update({ verified: true }, { where: { id } });
    },
};

module.exports = userOtpRepository;
