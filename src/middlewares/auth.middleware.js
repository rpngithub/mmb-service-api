const jwt = require('jsonwebtoken');
const tokenBlacklistService = require('../services/tokenBlacklist.service');

const authenticate = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.jti) return res.status(403).json({ error: 'Invalid token' });
    const revoked = await tokenBlacklistService.isBlacklisted(decoded.jti);
    if (revoked) return res.status(401).json({ error: 'Token has been revoked' });
    req.user = decoded;
    req.token = token;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

module.exports = authenticate;
