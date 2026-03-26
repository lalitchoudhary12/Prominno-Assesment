const Product = require("../models/Product");
const generatePDF = require("../utils/generatePDF");
const path = require('path');

exports.addProduct = async (req, res, next) => {
  try {
    let { brands, productName, productDescription } = req.body;
    if (typeof brands === 'string') {
      try {
        brands = JSON.parse(brands);
      } catch (e) {
        return res.status(400).json({ message: "Invalid brands format" });
      }
    }

    if (!Array.isArray(brands)) brands = [];

    const files = req.files || [];
    const brandsWithImages = brands.map((b, idx) => {
      const brand = { ...b };
      let matchedFile = null;
      if (b && b.image) {
        matchedFile = files.find(f => f.originalname === b.image);
      }
      if (!matchedFile && files[idx]) matchedFile = files[idx];

      if (matchedFile) {
        brand.image = `/uploads/${path.basename(matchedFile.path)}`;
      }

      return brand;
    });

    const product = await Product.create({
      productName,
      productDescription,
      brands: brandsWithImages,
      sellerId: req.user.id
    });

    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};


exports.getProducts = async (req, res, next) => {
  try {
    const page = +req.query.page || 1;
    const limit = 10;

    const products = await Product.find({ sellerId: req.user.id })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json(products);
  } catch (err) {
    next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    if (product.sellerId.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    await product.deleteOne();

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    next(err);
  }
};

exports.getProductPDF = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    generatePDF(product, res);
  } catch (err) {
    next(err);
  }
};