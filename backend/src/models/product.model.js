const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 160 },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, required: true, trim: true },
  image: { type: String, default: '' },
  description: { type: String, default: '', maxlength: 2000 },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  stock: { type: Number, default: 0, min: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
