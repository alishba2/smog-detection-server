const express = require('express');
const router = express.Router();
const { submitCustomerForm } = require('../controllers/customerController');

/**
 * @swagger
 * /api/customer/submit-form:
 *   post:
 *     summary: Submit customer form
 *     description: Submit a new customer form with vehicle and service details.
 *     operationId: submitCustomerForm
 *     tags:
 *       - Customer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the customer.
 *               email:
 *                 type: string
 *                 description: The email address of the customer.
 *               vehicleNumber:
 *                 type: string
 *                 description: The vehicle number of the customer.
 *               licensePlate:
 *                 type: string
 *                 description: The license plate number of the vehicle.
 *               vehicleModel:
 *                 type: string
 *                 description: The vehicle model.
 *               vehicleMake:
 *                 type: string
 *                 description: The vehicle make.
 *               year:
 *                 type: string
 *                 description: The year of the vehicle.
 *               service:
 *                 type: string
 *                 description: The service requested (standard_smog_check, enhanced_smog_check, pre_registration_inspection).
 *               bill:
 *                 type: object
 *                 properties:
 *                   serviceFee:
 *                     type: number
 *                     description: The fee for the service.
 *                   certificateFee:
 *                     type: number
 *                     description: The fee for the certificate.
 *               signature:
 *                 type: string
 *                 description: The customer's signature.
 *               technicianId:
 *                 type: string
 *                 description: The ID of the assigned technician.
 *     responses:
 *       201:
 *         description: Customer form submitted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Customer form submitted successfully!"
 *                 customer:
 *                   type: object
 *                   description: The newly created customer object.
 *       400:
 *         description: Required fields are missing.
 *       500:
 *         description: Internal server error.
 */
router.post('/submit-form', submitCustomerForm);



module.exports = router;
