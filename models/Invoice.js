const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  smogTestId: { type: mongoose.Schema.Types.ObjectId, ref: 'SmogTest', required: true },
  amount: { type: Number, required: true },
  invoiceDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Invoice', invoiceSchema);
