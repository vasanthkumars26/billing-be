const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: String,
  items: [
    {
      productId: String,
      name: String,
      price: Number,
      image: String,
      qty: Number,
    },
  ],
});

module.exports = mongoose.model("Cart", cartSchema);