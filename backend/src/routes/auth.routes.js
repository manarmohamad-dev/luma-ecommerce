const router = require('express').Router();
const { body } = require('express-validator');
const validate = require('../middlewares/validate.middleware');
const controller = require('../controllers/auth.controller');

router.post('/register', [body('name').trim().isLength({ min: 2, max: 80 }), body('email').isEmail().normalizeEmail(), body('password').isLength({ min: 8, max: 72 })], validate, controller.register);
router.post('/login', [body('email').isEmail().normalizeEmail(), body('password').isString().notEmpty()], validate, controller.login);

module.exports = router;
