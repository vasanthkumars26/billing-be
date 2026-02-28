// routes/orderRoutes.js
const express = require("express");
const Order = require("../models/Order");
const router = express.Router();

// User places order
router.post("/", async (req, res) => {
  try {
    const io = req.app.get("io");
    const orderData = req.body;

    if (!orderData.items || orderData.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const newOrder = await Order.create(orderData);

    if (io) io.emit("newOrder", newOrder);

    return res.status(201).json(newOrder);
  } catch (err) {
    console.error("Create order error:", err);
    return res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});

// Admin updates order status
router.put("/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    const io = req.app.get("io");
    if (io) io.emit("updateOrder", order);
    res.json(order);
  } catch (err) {
    console.error("Update order error:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});

// Admin gets all orders
router.get("/admin/all", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("Get orders error:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});

module.exports = router;