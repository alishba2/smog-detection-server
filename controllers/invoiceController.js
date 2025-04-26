const Invoice = require('../models/Invoice');
const SmogTest = require('../models/SmogTest');
const pdfkit = require('pdfkit');
const fs = require('fs');

// Create an invoice
exports.createInvoice = async (req, res) => {
  try {
    const { smogTestId, amount, invoiceDate } = req.body;

    // Find the smog test to generate an invoice
    const smogTest = await SmogTest.findById(smogTestId);
    if (!smogTest) {
      return res.status(404).json({ message: 'Smog test not found' });
    }

    const newInvoice = new Invoice({
      smogTestId,
      amount,
      invoiceDate: invoiceDate || new Date(),
    });

    await newInvoice.save();
    res.status(201).json({ message: 'Invoice created successfully', invoice: newInvoice });
  } catch (err) {
    res.status(500).json({ message: 'Error creating invoice', error: err });
  }
};

// Get an invoice by ID
exports.getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate('smogTestId');
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    res.json(invoice);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching invoice', error: err });
  }
};

// Generate a PDF invoice
exports.generatePDFInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate('smogTestId');
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    const doc = new pdfkit();
    const filePath = `./invoices/invoice_${req.params.id}.pdf`;

    doc.pipe(fs.createWriteStream(filePath));
    doc.fontSize(25).text('Invoice', { align: 'center' });

    doc.fontSize(18).text(`Smog Test ID: ${invoice.smogTestId._id}`);
    doc.fontSize(18).text(`Vehicle: ${invoice.smogTestId.vehicleNumber}`);
    doc.fontSize(18).text(`Amount: $${invoice.amount}`);
    doc.fontSize(18).text(`Invoice Date: ${invoice.invoiceDate.toDateString()}`);

    doc.end();

    res.sendFile(filePath, { root: __dirname });
  } catch (err) {
    res.status(500).json({ message: 'Error generating PDF', error: err });
  }
};
