const router = require('express').Router();
const { body, param } = require('express-validator');
const validate = require('../middlewares/validate.middleware');
const { protect } = require('../middlewares/auth.middleware');
const { allowRoles } = require('../middlewares/role.middleware');
const controller = require('../controllers/user.controller');

router.use(protect);
router.get('/profile', controller.profile);
router.patch('/profile', [body('name').optional().trim().isLength({ min: 2, max: 80 }), body('email').optional().isEmail().normalizeEmail()], validate, controller.updateProfile);
router.get('/cart', controller.getCart);
router.put('/cart', [body('productId').isMongoId(), body('quantity').isInt({ min: 1, max: 99 }).toInt()], validate, controller.saveCart);
router.delete('/cart/:productId', [param('productId').isMongoId()], validate, controller.removeCartItem);
router.get('/favorites', controller.getFavorites);
router.post('/favorites/:productId', [param('productId').isMongoId()], validate, controller.toggleFavorite);
router.get('/', allowRoles('admin'), controller.listUsers);
router.patch('/:id/ban', allowRoles('admin'), [param('id').isMongoId(), body('isBanned').isBoolean().toBoolean()], validate, controller.setBan);

module.exports = router;
