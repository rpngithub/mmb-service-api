const jwt = require('jsonwebtoken');
const tokenBlacklistService = require('../services/tokenBlacklist.service');

const authenticate = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided', code: 'NO_TOKEN' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.jti) return res.status(403).json({ error: 'Invalid token', code: 'INVALID_TOKEN' });
    const revoked = await tokenBlacklistService.isBlacklisted(decoded.jti);
    if (revoked) return res.status(401).json({ error: 'Token has been revoked', code: 'TOKEN_REVOKED' });
    req.user = decoded;
    req.token = token;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token', code: 'INVALID_OR_EXPIRED_TOKEN' });
  }
};

module.exports = authenticate;
