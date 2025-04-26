const express = require('express');
const router = express.Router();
const { updateTestResult, getServicesByCustomer } = require('../controllers/serviceController');



/**
 * @swagger
 * /api/services/get-service/{customerId}:
 *   get:
 *     summary: Get all services by customer ID
 *     description: Fetch all services related to a customer by their customer ID.
 *     tags:
 *       - Service
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         description: The customer ID to fetch services for.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved services for the customer.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   serviceId:
 *                     type: string
 *                     description: The unique identifier for the service.
 *                   technicianId:
 *                     type: string
 *                     description: The technician who handled the service.
 *                   customerId:
 *                     type: string
 *                     description: The customer related to the service.
 *                   testResult:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                         result:
 *                           type: string
 *                         comments:
 *                           type: string
 *       500:
 *         description: Internal Server Error
 */
router.get('/get-service/:customerId', getServicesByCustomer);



/**
 * @swagger
 * /api/services/update-test-results:
 *   put:
 *     summary: Update test result for a specific service and test
 *     description: Update the result and comments for a specific test of a service.
 *     tags:
 *       - Service
 *     parameters:
 *       - in: body
 *         name: testData
 *         required: true
 *         description: The test result data to update.
 *         schema:
 *           type: object
 *           required:
 *             - serviceId
 *             - testId
 *           properties:
 *             serviceId:
 *               type: string
 *               description: The ID of the service.
 *             testId:
 *               type: string
 *               description: The ID of the specific test to update.
 *             result:
 *               type: string
 *               description: The new result of the test (Pass/Fail).
 *             comments:
 *               type: string
 *               description: Additional comments on the test result.
 *     responses:
 *       200:
 *         description: Successfully updated the test result.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Test result updated successfully!"
 *       500:
 *         description: Internal Server Error
 */

router.put('/update-test-results', updateTestResult);

module.exports = router;
