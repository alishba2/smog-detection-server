// models/Customer.js
const mongoose = require('mongoose');

const AmountSchema = new mongoose.Schema({
  serviceFee: { type: Number, required: true },
  certificateFee: { type: Number, required: true }
});

const CustomerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  // phone: { type: String, required: true },
  email: { type: String },
  phone:{type:String},
  vehicleNumber: { type: String, required: true },
  licensePlate: { type: String, required: true },
  vehicleModel: { type: String },
  vehicleMake: { type: String },
  year: { type: String },
  customerType: { type: String, enum: ['New Customer', 'Returning Customer'], default: 'new customer' },
  bill: {
    type: AmountSchema,
    required: true
  },
  submittedAt: { type: Date, default: Date.now },
  signature: { type: String },
  technicianId: { type: mongoose.Schema.Types.ObjectId, ref: 'Technician', required: true },
  serviceStatus:{type:String, default:"active"},
  totalNumberOfVisits:{type:Number,default:0},
  lastVisitAt:Date,
  

});

module.exports = mongoose.model('Customer', CustomerSchema);
