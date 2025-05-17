const mongoose = require('mongoose');

const AccessSettingSchema = new mongoose.Schema({
  technicianId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Technician',
    required: true,
    unique: true
  },
  reports: {
    type: Boolean,
    default: false
  },
  totalJobs: {
    type: Boolean,
    default: false
  },

  totalRevenue: {
    type: Boolean,
    default: false
  },
  revenueToday: {
    type: Boolean,
    default: false
  },
  jobsToday: {
    type: Boolean,
    default: false
  },
});

module.exports = mongoose.model('AccessSetting', AccessSettingSchema);
