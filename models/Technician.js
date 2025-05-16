const mongoose = require('mongoose');

const TechnicianSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String },
  phone: String,
  shopName: String,
  shopAddress: String,
  role: {
    type: String,
    enum: ['owner', 'tech'],
    default: 'owner',
  },
  licenseNumber: String,
  createdAt: { type: Date, default: Date.now },
  isVerified: { type: Boolean, default: false },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  squareAccessToken: String,
  squareMerchantId: String,
  payPalAccessToken: String,
  paypalRefreshToken: String,
  creatorId: { type: String, required: false }
});

module.exports = mongoose.model('Technician', TechnicianSchema);
