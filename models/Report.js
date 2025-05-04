// models/Report.js
const mongoose = require('mongoose');

const ReportingSchema = new mongoose.Schema({
  technicianId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Technician',
    required: true
  },
  totalRevenue: {
    type: Number,
    default: 0
  },
  totalJobs: {
    type: Number,
    default: 0
  },
  todayJobs: {
    type: Number,
    default: 0
  },
  todayRevenue: {
    type: Number,
    default: 0
  },
  date: {
    type: Date,
    default: Date.now  
  }
});

module.exports = mongoose.model('Report', ReportingSchema);
