const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// 🟢 GET all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 🟢 POST a new product
router.post('/', async (req, res) => {
  try {
    const { name, price, image, description } = req.body;
    const newProduct = new Product({ name, price, image, description });
    await newProduct.save();
    res.json({ message: 'Product added', product: newProduct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error adding product' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, price, image, description } = req.body;
    const newProduct = new Product({ name, price, image, description });
    await newProduct.save();
    res.json({ message: 'Product added', product: newProduct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error adding product' });
  }
});

// 🟢 PUT update product
router.put('/:id', async (req, res) => {
  const { name, price, image, description } = req.body;
  try {
    await Product.findByIdAndUpdate(req.params.id, {
      name,
      price,
      image,
      description,
    });
    res.json({ message: 'Product updated' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating product' });
  }
});

// 🟢 DELETE product
router.delete('/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting product' });
  }
});

// ✅ Export router at the END
module.exports = router;


// 🟢 GET single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
