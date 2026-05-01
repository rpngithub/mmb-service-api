const User = require('../models/user.model');

// Looks up the full user from DB via mnemonic_id, checks User.role,
// and attaches req.dbUser so controllers don't need a second DB call.
const authorize = (...roles) => async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { mnemonic_id: req.user.id } });
    if (!user) return res.status(401).json({ error: 'User not found' });
    if (!roles.includes(user.role)) return res.status(403).json({ error: 'Forbidden: insufficient role' });
    req.dbUser = user;
    next();
  } catch (err) { next(err); }
};

module.exports = authorize;
