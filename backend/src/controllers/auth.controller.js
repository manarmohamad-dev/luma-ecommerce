const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const tokenFor = (user) => jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
const response = (res, status, user) => res.status(status).json({ success: true, token: tokenFor(user), user });

exports.register = async (req, res, next) => {
  try {
    const exists = await User.exists({ email: req.body.email.toLowerCase() });
    if (exists) return res.status(409).json({ success: false, message: 'Email is already registered' });
    const user = await User.create(req.body);
    response(res, 201, user);
  } catch (error) { next(error); }
};
exports.login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email.toLowerCase() }).select('+password');
    if (!user || !(await user.comparePassword(req.body.password))) return res.status(401).json({ success: false, message: 'Invalid email or password' });
    if (user.isBanned) return res.status(403).json({ success: false, message: 'Account is banned' });
    response(res, 200, user);
  } catch (error) { next(error); }
};
