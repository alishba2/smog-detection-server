const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');

// POST - Create an invoice for a smog test
router.post('/create', invoiceController.createInvoice);

// GET - Get an invoice by ID
router.get('/:id', invoiceController.getInvoiceById);

// GET - Generate a PDF invoice
router.get('/:id/pdf', invoiceController.generatePDFInvoice);

module.exports = router;
