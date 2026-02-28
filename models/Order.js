const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userName: String,
    phone: String,
    address: String,
    items: [
      {
        productId: String,
        name: String,
        price: Number,
        qty: Number,
        
      },
    ],
    total: Number,
    status: { type: String, default: "Pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);