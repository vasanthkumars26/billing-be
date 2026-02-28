// // server.js
// const express = require("express");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const path = require("path");
// const http = require("http");
// const { Server } = require("socket.io");

// const connectDB = require("./config/db");
// const invoiceRoutes = require("./routes/invoiceRoutes");
// const enquiryRoutes = require("./routes/enquiryRoutes");
// const adminRoutes = require("./routes/adminRoutes");
// const productRoutes = require("./routes/productRoutes");
// const orderRoutes = require("./routes/orderRoutes");
// const cartRoutes = require("./routes/cartRoutes");
// const orderInvRoutes = require("./routes/OrderinvRoute.js");

// dotenv.config();
// connectDB();

// const app = express();
// app.use(cors({
//   origin: [
//     "http://localhost:5173",
//     "https://billing-fe-delta.vercel.app"
//   ],
//   credentials: true
// }));
// app.use(express.json());

// // Static folders
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// app.use("/pdfs", express.static(path.join(__dirname, "invoices")));
// app.use("/invoices", express.static("invoices"));
// // API routes
// app.use("/api/invoices", invoiceRoutes);
// app.use("/api/enquiries", enquiryRoutes);
// app.use("/api/admin", adminRoutes);
// app.use("/api/products", productRoutes);
// app.use("/api/orders", orderRoutes);
// app.use("/api/cart", cartRoutes); 
// app.use("/api/orderinvoices", orderInvRoutes);

// // ---------------- Socket.io ----------------
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: [
//       "http://localhost:5173",
//       "https://billing-fe-delta.vercel.app"
//     ],
//     methods: ["GET", "POST"]
//   }
// });

// // Make io accessible in routes
// app.set("io", io);

// io.on("connection", (socket) => {
//   console.log("New client connected:", socket.id);

//   socket.on("disconnect", () => {
//     console.log("Client disconnected:", socket.id);
//   });
// });

// // ---------------- Start Server ----------------
// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const invoiceRoutes = require("./routes/invoiceRoutes");
const enquiryRoutes = require("./routes/enquiryRoutes");
const adminRoutes = require("./routes/adminRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderInvRoutes = require("./routes/OrderinvRoute.js");

dotenv.config();
connectDB();

const app = express();

/* ---------------- CORS ---------------- */
const allowedOrigins = [
  "http://localhost:5173",
  "https://billing-fe-delta.vercel.app",
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

/* ---------------- Static folders ---------------- */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/pdfs", express.static(path.join(__dirname, "invoices")));
app.use("/invoices", express.static("invoices"));

/* ---------------- API routes ---------------- */
app.use("/api/invoices", invoiceRoutes);
app.use("/api/enquiries", enquiryRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orderinvoices", orderInvRoutes);

/* ---------------- Socket.io ---------------- */
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Make io accessible in routes
app.set("io", io);

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

/* ---------------- Start Server ---------------- */
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});