const tokenBlacklistRepository = require('../repositories/tokenBlacklist.repository');

class TokenBlacklistService {
  async blacklist(jti, expiresAt) {
    return tokenBlacklistRepository.add(jti, expiresAt);
  }

  async isBlacklisted(jti) {
    return tokenBlacklistRepository.exists(jti);
  }
}

module.exports = new TokenBlacklistService();
