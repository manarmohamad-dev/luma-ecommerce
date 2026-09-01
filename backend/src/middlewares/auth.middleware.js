const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

exports.protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : null;
    if (!token) return res.status(401).json({ success: false, message: 'Authentication required' });
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(id);
    if (!user || user.isBanned) return res.status(401).json({ success: false, message: 'Account is unavailable' });
    req.user = user;
    next();
  } catch (_) {
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};
