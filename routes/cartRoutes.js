const express = require("express");
const Cart = require("../models/Cart");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// GET CART
router.get("/", authMiddleware, async (req, res) => {
  let cart = await Cart.findOne({ userId: req.user.uid });
  if (!cart) cart = await Cart.create({ userId: req.user.uid, items: [] });
  res.json(cart);
});

// ADD TO CART
router.post("/", authMiddleware, async (req, res) => {
  let cart = await Cart.findOne({ userId: req.user.uid });

  if (!cart) {
    cart = new Cart({ userId: req.user.uid, items: [req.body] });
  } else {
    const index = cart.items.findIndex(i => i.productId === req.body.productId);
    if (index > -1) cart.items[index].qty += 1;
    else cart.items.push(req.body);
  }

  await cart.save();
  res.json(cart);
});

// REMOVE ITEM
router.delete("/:productId", authMiddleware, async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user.uid });
  cart.items = cart.items.filter(i => i.productId !== req.params.productId);
  await cart.save();
  res.json(cart);
});

module.exports = router;