const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Rating Schema
const ratingSchema = new mongoose.Schema({
  productId: String,
  userId: String,    // Optional — use if you want
  rating: Number,
  createdAt: { type: Date, default: Date.now }
});

const Rating = mongoose.model('Rating', ratingSchema);

// POST — Add a rating
router.post('/', async (req, res) => {
  const { productId, userId, rating } = req.body;

  if (!productId || !rating) {
    return res.status(400).json({ message: 'Product ID and rating are required.' });
  }

  try {
    const newRating = new Rating({ productId, userId, rating });
    await newRating.save();
    res.json({ message: 'Rating saved successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// GET — Average rating of a product
router.get('/:productId/average', async (req, res) => {
  try {
    const result = await Rating.aggregate([
      { $match: { productId: req.params.productId } },
      { $group: { _id: '$productId', avgRating: { $avg: '$rating' } } }
    ]);

    const avgRating = result[3]?.avgRating || 4;
    res.json({ productId: req.params.productId, averageRating: avgRating.toFixed(1) });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

module.exports = router;
