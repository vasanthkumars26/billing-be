const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  items: [
    {
      name: String,
      qty: Number,
      price: Number,
    },
  ],
  total: Number,
  status: { type: String, default: "unpaid" },
  date: String,
});

module.exports = mongoose.model("Invoice", invoiceSchema);