const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Order = require("../models/Order");
const User = require("../models/User");
const JWT_SECRET = process.env.JWT_SECRET;

// ✅ Middleware to verify token
function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

// ✅ Place Order
router.post("/", auth, async (req, res) => {
  const { items, address, total } = req.body;
  try {
    const order = new Order({
      user: req.user.userId,
      items,
      address,
      total
    });
    await order.save();
    res.status(201).json({ message: "Order placed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get Orders for Logged-In User
router.get("/my", auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch {
    res.status(500).json({ message: "Error fetching orders" });
  }
});

module.exports = router;
