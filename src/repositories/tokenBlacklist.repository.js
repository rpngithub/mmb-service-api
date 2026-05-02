const TokenBlacklist = require('../models/tokenBlacklist.model');

class TokenBlacklistRepository {
  async add(jti, expires_at) {
    return TokenBlacklist.create({ jti, expires_at });
  }

  async exists(jti) {
    const record = await TokenBlacklist.findOne({ where: { jti } });
    return !!record;
  }
}

module.exports = new TokenBlacklistRepository();
