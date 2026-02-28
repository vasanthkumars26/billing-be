const PDFDocument = require("pdfkit");
const fsExtra = require("fs-extra");

const generateInvoicePDF = async (order) => {
  fsExtra.ensureDirSync("invoices"); // create folder if not exists
  const filePath = `invoices/${order._id}.pdf`;

  const doc = new PDFDocument();
  doc.pipe(fsExtra.createWriteStream(filePath));

  doc.fontSize(20).text(`Invoice for Order: ${order._id}`, { underline: true });
  doc.moveDown();

  order.items.forEach(i => {
    doc.fontSize(14).text(`${i.name} x ${i.qty} = ₹${i.price * i.qty}`);
  });

  doc.moveDown();
  doc.fontSize(16).text(`Total: ₹${order.total}`, { bold: true });
  doc.end();

  return filePath; // return PDF path
};

module.exports = { generateInvoicePDF };