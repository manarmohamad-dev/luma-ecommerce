require('dotenv').config();
const connectDatabase = require('../config/db');
const Product = require('../models/product.model');
const User = require('../models/user.model');

const products = [
  { title: 'حقيبة ظهر للسفر', price: 109.95, category: 'إلكترونيات', image: 'assets/backpack.jpg', description: 'حقيبة عملية بجودة ممتازة، مناسبة للسفر والاستخدام اليومي.', rating: 4.5, stock: 18 },
  { title: 'تيشيرت قطني', price: 22.3, category: 'ملابس رجالية', image: 'assets/tshirt.jpg', description: 'تيشيرت قطني مريح بتصميم عصري.', rating: 4.2, stock: 35 },
  { title: 'خاتم فضي', price: 168, category: 'مجوهرات', image: 'assets/ring.jpg', description: 'خاتم أنيق من الفضة بتفاصيل راقية.', rating: 4.7, stock: 12 },
  { title: 'جاكيت نسائي', price: 39.99, category: 'ملابس نسائية', image: 'assets/jacket.jpg', description: 'جاكيت خفيف مثالي للربيع والخريف.', rating: 4.4, stock: 22 },
];

(async () => {
  await connectDatabase();
  await Product.deleteMany();
  await User.deleteMany();
  await Product.insertMany(products);
  await User.create({ name: 'Administrator', email: 'admin@example.com', password: 'Admin12345', role: 'admin' });
  console.log('Database seeded');
  process.exit(0);
})().catch((error) => { console.error(error.message); process.exit(1); });
