const express = require('express');
const router = express.Router();

const { 
    paypalRedirectOAuth, 
    paypalCallback, 
    squareAuthCallback, 
    squareRedirectOAuth 
} = require('../controllers/pyamentController');

// Square payment route
/**
 * @swagger
 * /api/payment/square/payment:
 *   post:
 *     summary: Process payment using Square
 *     description: Initiates payment via Square using the technician's access token
 *     parameters:
 *       - name: technicianId
 *         in: body
 *         description: Technician's unique ID to look up their access token
 *         required: true
 *         schema:
 *           type: string
 *       - name: amount
 *         in: body
 *         description: Payment amount
 *         required: true
 *         schema:
 *           type: number
 *           example: 100.00
 *     responses:
 *       200:
 *         description: Payment processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "payment_id"
 *       400:
 *         description: Technician not connected to Square
 *       500:
 *         description: Payment failed with Square
 */
router.post('/square/payment', async (req, res) => {
    try {
        // Extracting technicianId and amount from the body
        const { technicianId, amount } = req.body;

        // Call Square payment handler here
        // Implement Square payment logic with technician access token
        const response = await squarePayment(technicianId, amount); // squarePayment is a function to handle payment logic

        res.status(200).json({
            id: response.paymentId,
            message: 'Payment processed successfully with Square'
        });
    } catch (error) {
        console.error('Square Payment Error:', error);
        res.status(500).json({ message: 'Payment failed with Square' });
    }
});

// PayPal payment route
/**
 * @swagger
 * /api/payment/paypal/payment:
 *   post:
 *     summary: Process payment using PayPal
 *     description: Initiates payment via PayPal using the technician's access token
 *     parameters:
 *       - name: technicianId
 *         in: body
 *         description: Technician's unique ID to look up their access token
 *         required: true
 *         schema:
 *           type: string
 *       - name: amount
 *         in: body
 *         description: Payment amount
 *         required: true
 *         schema:
 *           type: number
 *           example: 100.00
 *     responses:
 *       200:
 *         description: Payment processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "payment_id"
 *       400:
 *         description: Technician not connected to PayPal
 *       500:
 *         description: Payment failed with PayPal
 */
router.post('/paypal/payment', async (req, res) => {
    try {
        // Extracting technicianId and amount from the body
        const { technicianId, amount } = req.body;

        // Call PayPal payment handler here
        // Implement PayPal payment logic with technician access token
        const response = await paypalPayment(technicianId, amount); // paypalPayment is a function to handle payment logic

        res.status(200).json({
            id: response.paymentId,
            message: 'Payment processed successfully with PayPal'
        });
    } catch (error) {
        console.error('PayPal Payment Error:', error);
        res.status(500).json({ message: 'Payment failed with PayPal' });
    }
});

// Square OAuth redirect route
router.get('/square/redirect', squareRedirectOAuth);

// Square OAuth callback route
router.get('/square/callback', squareAuthCallback);

// PayPal OAuth redirect route
router.get('/paypal/redirect', paypalRedirectOAuth);

// PayPal OAuth callback route
router.get('/paypal/callback', paypalCallback);

module.exports = router;
