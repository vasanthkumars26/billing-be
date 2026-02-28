// // models/OrderInvoice.js
// const mongoose = require("mongoose");

// const orderInvoiceSchema = new mongoose.Schema({
//   orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   items: [
//     {
//       productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
//       name: String,
//       qty: Number,
//       price: Number,
//     }
//   ],
//   total: Number,
//   status: { type: String, default: "generated" },
//   createdAt: { type: Date, default: Date.now },
//   pdfUrl: String // optional: store PDF URL if you generate PDFs
// });

// module.exports = mongoose.model("OrderInvoice", orderInvoiceSchema);

// models/OrderInvoice.js
const mongoose = require("mongoose");

const orderInvoiceSchema = new mongoose.Schema({
  orderId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Order", 
    required: true 
  },

  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" 
  },

  // 🔥 STORE CUSTOMER NAME
  userName: { 
    type: String 
  },

  // (optional but useful)
  userEmail: { 
    type: String 
  },

  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      name: String,
      qty: Number,
      price: Number,
    }
  ],

  total: { 
    type: Number, 
    required: true 
  },

  status: { 
    type: String, 
    default: "generated" 
  },

  createdAt: { 
    type: Date, 
    default: Date.now 
  },

  pdfUrl: String
});

module.exports = mongoose.model("OrderInvoice", orderInvoiceSchema);