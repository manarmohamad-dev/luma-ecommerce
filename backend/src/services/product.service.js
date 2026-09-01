const Product = require('../models/product.model');

exports.findProducts = async ({ search, category, page = 1, limit = 24 }) => {
  const filter = {};
  if (search) filter.title = { $regex: search, $options: 'i' };
  if (category) filter.category = category;
  const safeLimit = Math.min(Math.max(Number(limit), 1), 100);
  const safePage = Math.max(Number(page), 1);
  const [products, total] = await Promise.all([Product.find(filter).sort({ createdAt: -1 }).skip((safePage - 1) * safeLimit).limit(safeLimit), Product.countDocuments(filter)]);
  return { products, pagination: { page: safePage, limit: safeLimit, total, pages: Math.ceil(total / safeLimit) } };
};
