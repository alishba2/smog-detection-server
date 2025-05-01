const express = require('express');
const router = express.Router();
const { updateTestResult, getServicesByCustomer, getServicesByTechnician,getServiceById } = require('../controllers/serviceController');
const authGuard = require('../middlewares/authGuard'); 

/**
 * @swagger
 * /api/service/get-service/{customerId}:
 *   get:
 *     summary: Get all services by customer ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Service
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved services
 */
router.get('/get-service/:customerId', authGuard, getServicesByCustomer);

/**
 * @swagger
 * /api/service/get-service-by-tech/{techId}:
 *   get:
 *     summary: Get all services by technician ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Service
 *     parameters:
 *       - in: path
 *         name: techId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved services
 */
router.get('/get-service-by-tech/:techId', authGuard, getServicesByTechnician);

/**
 * @swagger
 * /api/service/update-test-results:
 *   put:
 *     summary: Update test result for a service
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Service
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - serviceId
 *               - testId
 *             properties:
 *               serviceId:
 *                 type: string
 *               testId:
 *                 type: string
 *               result:
 *                 type: string
 *               comments:
 *                 type: string
 *     responses:
 *       200:
 *         description: Test result updated
 */
router.put('/update-test-results', authGuard, updateTestResult);

/**
 * @swagger
 * /api/service/getServiceById/{serviceId}:
 *   get:
 *     summary: Get service details by service ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Service
 *     parameters:
 *       - in: path
 *         name: serviceId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved service details
 */
router.get('/getServiceById/:serviceId', authGuard, getServiceById);

module.exports = router;
