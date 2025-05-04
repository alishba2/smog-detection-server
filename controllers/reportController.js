// controllers/reportController.js
const Report = require('../models/Report');


const getReportByTechnician = async (req, res) => {
    try {
      const { technicianId } = req.params;  
  
      // Fetch the report for the technician
      const report = await Report.findOne({ technicianId }).sort({ date: -1 }); 
  
      if (!report) {
        return res.status(404).json({ message: 'Report not found for the specified technician.' });
      }
  
      res.status(200).json({
        message: 'Report fetched successfully.',
        report
      });
    } catch (error) {
      console.error('Error fetching report for technician:', error);
      res.status(500).json({ message: 'Error fetching report for technician.', error: error.message });
    }
  };

module.exports = {
  
  getReportByTechnician
};
