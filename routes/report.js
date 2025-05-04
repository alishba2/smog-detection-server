const express = require('express');
const router = express.Router();
const {getReportByTechnician} = require('../controllers/reportController');

const authGuard = require('../middlewares/authGuard');

/**
 * @swagger
 * /api/report/get-report-by-technician/{technicianId}:
 *   get:
 *     summary: Get the most recent report for a technician
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Reports
 *     parameters:
 *       - in: path
 *         name: technicianId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved the report
 *       404:
 *         description: Report not found for the specified technician
 *       500:
 *         description: Error occurred while fetching the report
 */

router.get('/get-report-by-technician/:technicianId', authGuard, getReportByTechnician);
module.exports = router;
