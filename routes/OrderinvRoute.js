const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const OrderInvoice = require("../models/OrderInvoice");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

/* =========================
   GET ALL ORDER INVOICES
   ========================= */
router.get("/", async (req, res) => {
  try {
    const invoices = await OrderInvoice.find().sort({ createdAt: -1 });
    res.json(invoices);
  } catch (err) {
    console.error("Fetch order invoices error:", err);
    res.status(500).json({ message: "Failed to fetch order invoices" });
  }
});

/* =========================
   GET SINGLE ORDER INVOICE
   ========================= */
router.get("/:id", async (req, res) => {
  try {
    const invoice = await OrderInvoice.findById(req.params.id);
    if (!invoice)
      return res.status(404).json({ message: "Invoice not found" });

    res.json(invoice);
  } catch (err) {
    console.error("Fetch invoice error:", err);
    res.status(500).json({ message: "Failed to fetch invoice" });
  }
});

/* =========================
   GENERATE ORDER INVOICE
   ========================= */
router.post("/generate/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order)
      return res.status(404).json({ message: "Order not found" });

    // 📁 ensure invoices folder exists
    const invoicesDir = path.join(__dirname, "../invoices");
    if (!fs.existsSync(invoicesDir)) fs.mkdirSync(invoicesDir);

    const pdfFileName = `invoice_${order._id}.pdf`;
    const pdfPath = path.join(invoicesDir, pdfFileName);

    const doc = new PDFDocument();
    const stream = fs.createWriteStream(pdfPath);
    doc.pipe(stream);

    doc.fontSize(20).text("INVOICE", { align: "center" });
    doc.moveDown();
    doc.text(`Order ID: ${order._id}`);
    doc.text(`User: ${order.userName || order.userEmail || "N/A"}`);
    doc.text(`Total: ₹${order.total}`);
    doc.moveDown();
    doc.text("Products:");

    order.items.forEach((item) => {
      doc.text(`${item.name} x ${item.qty} = ₹${item.price * item.qty}`);
    });

    doc.end();

    stream.on("finish", async () => {
      const invoice = await OrderInvoice.create({
        orderId: order._id,
        userId: order.userId,
        items: order.items,
        total: order.total,
        status: "generated",
        pdfUrl: `invoices/${pdfFileName}`
      });

      res.json(invoice);
    });

    stream.on("error", (err) => {
      console.error("PDF stream error:", err);
      res.status(500).json({ message: "PDF write failed" });
    });

  } catch (err) {
    console.error("Generate invoice error:", err);
    res.status(500).json({ message: "Failed to generate invoice" });
  }
});

module.exports = router;