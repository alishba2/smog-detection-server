const Service = require('../models/Service');
const Customer = require('../models/Customer');
const moment = require('moment');

// Overview Analytics (total customers, total services, revenue, passed and failed tests)
exports.getOverview = async (req, res) => {
  try {
    const totalCustomers = await Customer.countDocuments();
    const totalServices = await Service.countDocuments();
    const passedTests = await Service.countDocuments({ result: 'pass' });
    const failedTests = await Service.countDocuments({ result: 'fail' });
    
    const totalRevenue = await Service.aggregate([
      { $match: { result: 'pass' } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const revenue = totalRevenue[0] ? totalRevenue[0].total : 0;

    res.json({
      totalCustomers,
      totalServices,
      passedTests,
      failedTests,
      totalRevenue: revenue
    });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err });
  }
};

// Daily Analytics (services and revenue by day)
exports.getDailyAnalytics = async (req, res) => {
  try {
    const dailyData = await Service.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$testDate" } },
          totalServices: { $sum: 1 },
          totalRevenue: { $sum: "$amount" }
        }
      },
      { $sort: { "_id": -1 } }
    ]);

    res.json(dailyData);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err });
  }
};

// Monthly Analytics (services and revenue by month)
exports.getMonthlyAnalytics = async (req, res) => {
  try {
    const monthlyData = await Service.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$testDate" } },
          totalServices: { $sum: 1 },
          totalRevenue: { $sum: "$amount" }
        }
      },
      { $sort: { "_id": -1 } }
    ]);

    res.json(monthlyData);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err });
  }
};
