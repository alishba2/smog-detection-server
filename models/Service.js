const mongoose = require('mongoose');

// const TestResultSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   result: { type: String, required: true, enum: ['Pending', 'Pass', 'Fail'] },
//   comments: { type: String }
// });

const ServiceSchema = new mongoose.Schema({
  jobId: String,
  technicianId: { type: mongoose.Schema.Types.ObjectId, ref: 'Technician', required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  serviceDate: { type: Date, default: Date.now },
  // testResult: { type: [TestResultSchema], required: true },
  passed: { type: Boolean, default: null },
  status: { type: String, enum: ['active', 'closed'], default: 'active' },
  createdAt: { type: Date, default: Date.now() },
  paymentStatus: {
    type: String,
    enum: ['Pending Payment', 'Paid', 'Failed'],
    default: 'Pending Payment'
  },
  paymentType: {
    type: String,
    enum: ['online', 'cash'],
    default: 'cash'
  }


});

module.exports = mongoose.model('Service', ServiceSchema);
