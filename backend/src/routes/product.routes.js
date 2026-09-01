const router = require('express').Router();
const { body, param, query } = require('express-validator');
const controller = require('../controllers/product.controller');
const validate = require('../middlewares/validate.middleware');
const { protect } = require('../middlewares/auth.middleware');
const { allowRoles } = require('../middlewares/role.middleware');

const id = param('id').isMongoId();
const productValidation = (optional = false) => {
  const field = (name) => (optional ? body(name).optional() : body(name));
  return [
  field('title').trim().isLength({ min: 2, max: 160 }),
  field('price').isFloat({ min: 0 }).toFloat(),
  field('category').trim().isLength({ min: 2, max: 80 }),
  body('image').optional().isString(),
  body('description').optional().isString().isLength({ max: 2000 }),
  body('rating').optional().isFloat({ min: 0, max: 5 }).toFloat(),
  body('stock').optional().isInt({ min: 0 }).toInt(),
  ];
};

router.get('/', [query('page').optional().isInt({ min: 1 }).toInt(), query('limit').optional().isInt({ min: 1, max: 100 }).toInt()], validate, controller.list);
router.get('/:id', [id], validate, controller.getOne);
router.post('/', protect, allowRoles('admin'), productValidation(), validate, controller.create);
router.patch('/:id', protect, allowRoles('admin'), [id, ...productValidation(true)], validate, controller.update);
router.delete('/:id', protect, allowRoles('admin'), [id], validate, controller.remove);

module.exports = router;
