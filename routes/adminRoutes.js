const express = require("express");
const Invoice = require("../models/Invoice");
const User = require("../models/User");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();


router.get("/role/:uid", async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.params.uid });
    res.json({ role: user?.role || "user" });
  } catch (err) {
    res.status(500).json({ message: "Error fetching role" });
  }
});


router.get("/invoices", adminMiddleware, async (req, res) => {
  try {
    const invoices = await Invoice.find();
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch invoices" });
  }
});


router.get("/users", adminMiddleware, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});


router.delete("/users/:id", adminMiddleware, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user" });
  }
});

module.exports = router;