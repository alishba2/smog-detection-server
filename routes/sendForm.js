const { sendFormLink } = require('../controllers/sendFormController'); // or separate controller if you prefer
const express = require('express');
const router = express.Router();
/**
 * @swagger
 * /api/send-form-link:
 *   post:
 *     summary: Send form link to user via SMS
 *     tags: [Send Form To Customers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *               - formLink
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "+1234567890"
 *               formLink:
 *                 type: string
 *                 example: "https://yourwebsite.com/form"
 *     responses:
 *       200:
 *         description: Form link sent successfully via SMS
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Form link sent successfully via SMS.
 *       400:
 *         description: Phone number or form link missing
 *       500:
 *         description: Server error or SMS sending failed
 */

router.post('/send-form-link', sendFormLink);
module.exports =router;