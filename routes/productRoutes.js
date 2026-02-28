// const express = require("express");
// const Product = require("../models/Product");
// const authMiddleware = require("../middleware/authMiddleware");
// const adminMiddleware = require("../middleware/adminMiddleware");
// const multer = require("multer");
// const path = require("path");

// const router = express.Router();

// // storage
// const storage = multer.diskStorage({
//   destination: "uploads/",
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });

// const upload = multer({ storage });

// // GET products (public)
// router.get("/", async (req, res) => {
//   const products = await Product.find();
//   res.json(products);
// });

// // ADD product (admin only)
// router.post(
//   "/",
//   authMiddleware,
//   adminMiddleware,
//   upload.single("image"),
//   async (req, res) => {
//     const product = new Product({
//       name: req.body.name,
//       price: req.body.price,
//       image: req.file
//         ? `http://localhost:5000/uploads/${req.file.filename}`
//         : "",
//     });

//     await product.save();
//     res.json(product);
//   }
// );

// // UPDATE
// router.put(
//   "/:id",
//   authMiddleware,
//   adminMiddleware,
//   upload.single("image"),
//   async (req, res) => {
//     const data = {
//       name: req.body.name,
//       price: req.body.price,
//     };

//     if (req.file) {
//       data.image = `http://localhost:5000/uploads/${req.file.filename}`;
//     }

//     const product = await Product.findByIdAndUpdate(req.params.id, data, {
//       new: true,
//     });

//     res.json(product);
//   }
// );

// // DELETE
// router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
//   await Product.findByIdAndDelete(req.params.id);
//   res.json({ message: "Deleted" });
// });

// module.exports = router;

const express = require("express");
const Product = require("../models/Product");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// storage
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// helper to build base URL dynamically
const getBaseUrl = (req) => `${req.protocol}://${req.get("host")}`;

// GET products (public)
router.get("/", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// ADD product (admin only)
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  async (req, res) => {
    const baseUrl = getBaseUrl(req);

    const product = new Product({
      name: req.body.name,
      price: req.body.price,
      image: req.file
        ? `${baseUrl}/uploads/${req.file.filename}`
        : "",
    });

    await product.save();
    res.json(product);
  }
);

// UPDATE product
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  async (req, res) => {
    const baseUrl = getBaseUrl(req);

    const data = {
      name: req.body.name,
      price: req.body.price,
    };

    if (req.file) {
      data.image = `${baseUrl}/uploads/${req.file.filename}`;
    }

    const product = await Product.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });

    res.json(product);
  }
);

// DELETE product
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;