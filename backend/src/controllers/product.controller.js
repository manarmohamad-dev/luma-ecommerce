const Product = require('../models/product.model');
const { findProducts } = require('../services/product.service');

exports.list = async (req, res, next) => { try { res.json({ success: true, data: await findProducts(req.query) }); } catch (error) { next(error); } };
exports.getOne = async (req, res, next) => { try { const product = await Product.findById(req.params.id); if (!product) return res.status(404).json({ success: false, message: 'Product not found' }); res.json({ success: true, data: product }); } catch (error) { next(error); } };
exports.create = async (req, res, next) => { try { res.status(201).json({ success: true, data: await Product.create(req.body) }); } catch (error) { next(error); } };
exports.update = async (req, res, next) => { try { const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }); if (!product) return res.status(404).json({ success: false, message: 'Product not found' }); res.json({ success: true, data: product }); } catch (error) { next(error); } };
exports.remove = async (req, res, next) => { try { const product = await Product.findByIdAndDelete(req.params.id); if (!product) return res.status(404).json({ success: false, message: 'Product not found' }); res.json({ success: true, message: 'Product deleted' }); } catch (error) { next(error); } };
