// models/Technician.js
const mongoose = require('mongoose');
const TechnicianSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String },
  phone: String,
  shopName: String,
  shopAddress: String,
  licenseNumber: String,
  createdAt: { type: Date, default: Date.now },
  isVerified: { type: Boolean, default: false },
  resetPasswordToken: String, 
  resetPasswordExpires: Date,
});
module.exports = mongoose.model('Technician', TechnicianSchema);
