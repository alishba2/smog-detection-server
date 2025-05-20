const express = require('express');
const router = express.Router();
const { submitCustomerForm } = require('../controllers/customerController');
const { getCustomerHistory } = require('../controllers/customerController');
const { getAllCustomers } = require('../controllers/customerController');
const authGuard = require('../middlewares/authGuard');
const sendInvoiceEmail = require('../utility/sendInvoiceToCustomer');
const multer = require('multer');
const path = require('path');

// Multer setup to handle file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Ensure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

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

/**
 * @swagger
 * /api/customer/customer-history:
 *   get:
 *     summary: Get customer history
 *     description: Get the history of services for a customer, filtered by closed status.
 *     operationId: getCustomerHistory
 *     tags:
 *       - Customer
 *     parameters:
 *       - in: query
 *         name: customerId
 *         schema:
 *           type: string
 *         required: true
 *         description: The unique identifier of the customer.
 *       - in: query
 *         name: technicianId
 *         schema:
 *           type: string
 *         required: true
 *         description: The unique identifier of the technician.
 *     responses:
 *       200:
 *         description: Customer history retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   jobId:
 *                     type: string
 *                   technicianId:
 *                     type: string
 *                   customerId:
 *                     type: string
 *                   serviceDate:
 *                     type: string
 *                     format: date-time
 *                   passed:
 *                     type: boolean
 *       400:
 *         description: Invalid parameters provided.
 *       500:
 *         description: Internal server error.
 */

router.post('/submit-form', submitCustomerForm);

// Example usage of the function in your route
router.get('/customer-history', async (req, res) => {
  const { customerId, technicianId } = req.query;
  try {
    const history = await getCustomerHistory(customerId, technicianId);
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/customer/customer-data:
 *   get:
 *     summary: Get all customers for a technician
 *     description: Retrieve all customer records associated with the currently logged-in technician.
 *     operationId: getAllCustomers
 *     tags:
 *       - Customer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of customers retrieved successfully.
 *  */
router.get('/customer-data', authGuard, getAllCustomers)


app.post('/send-invoice', upload.single('invoice'), async (req, res) => {
  try {
    const to = req.body.email;
    const file = req.file;
    await sendInvoiceEmail(to, file);
    res.send('Invoice sent!');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to send invoice.');
  }
});


module.exports = router;
