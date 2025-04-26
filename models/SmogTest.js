const mongoose = require('mongoose');

const smogTestSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  vehicleNumber: { type: String, required: true },
  testDate: { type: Date, required: true },
  technicianId: { type: mongoose.Schema.Types.ObjectId, ref: 'Technician', required: true },
  result: { type: String, enum: ['pass', 'fail', 'pending'], default: 'pending' },
  amount: { type: Number, required: false },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('SmogTest', smogTestSchema);
