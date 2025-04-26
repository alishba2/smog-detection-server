const mongoose = require('mongoose');

const TestResultSchema = new mongoose.Schema({
  name: { type: String, required: true },
  result: { type: String, required: true, enum: ['Pending', 'Pass', 'Fail'] },
  comments: { type: String }
});

const ServiceSchema = new mongoose.Schema({
  technicianId: { type: mongoose.Schema.Types.ObjectId, ref: 'Technician', required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  serviceDate: { type: Date, default: Date.now },
  testResult: { type: [TestResultSchema], required: true },
  passed: { type: Boolean, default: false }
});

module.exports = mongoose.model('Service', ServiceSchema);
