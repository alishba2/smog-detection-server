const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

// Get overall analytics
router.get('/overview', analyticsController.getOverview);

// Get daily analytics (services and revenue)
router.get('/daily', analyticsController.getDailyAnalytics);

// Get monthly analytics (services and revenue)
router.get('/monthly', analyticsController.getMonthlyAnalytics);

module.exports = router;
