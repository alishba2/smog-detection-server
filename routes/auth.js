const express = require('express');
const router = express.Router();
const { registerTechnician, loginTechnician, googleAuth, verifyEmail, resetPassword, resetPasswordRequest, getCurrentTechnician,createTech,getTech,deleteTech } = require('../controllers/authController');
const authGuard = require('../middlewares/authGuard');

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Technician authentication
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new technician
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: technician@example.com
 *               password:
 *                 type: string
 *                 example: yourpassword
 *     responses:
 *       201:
 *         description: Technician registered successfully
 *       400:
 *         description: Email already registered
 *       500:
 *         description: Server error
 */
router.post('/register', registerTechnician);



/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Technician login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: technician@example.com
 *               password:
 *                 type: string
 *                 example: yourpassword
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
router.post('/login', loginTechnician);



// Google Auth Technician
/**
 * @swagger
 * /api/auth/google:
 *   post:
 *     summary: Login/Register technician using Google
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 example: your-google-id-token
 *     responses:
 *       200:
 *         description: Successful Google login/register
 *       500:
 *         description: Google authentication failed
 */
router.post('/google', googleAuth);
/**
 * @swagger
 * /api/auth/verify-email:
 *   get:
 *     summary: Verify the email address of the technician.
 *     description: Verifies the email address by the token sent in the registration email.
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         description: The email verification token.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Email verified successfully.
 *       400:
 *         description: Invalid or expired token.
 *       404:
 *         description: Technician not found.
 *     tags:
 *       - Authentication
 */
router.get('/verify-email', verifyEmail);



/**
 * @swagger
* /api/auth/create-tech:
 *   post:
 *     summary: Register a new technician
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: technician@example.com
 *               password:
 *                 type: string
 *                 example: yourpassword
 *     responses:
 *       201:
 *         description: Technician registered successfully
 *       400:
 *         description: Email already registered
 *       500:
 *         description: Server error
 */
router.post('/create-tech',authGuard, createTech);

/**
 * @swagger
 * /api/auth/get-techs-by-creator:
 *   get:
 *     summary: Get all technicians created by logged-in user
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: List of technicians
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

router.get('/get-techs-by-creator',authGuard, getTech);


/**
 * @swagger
 * /api/auth/get-techs-by-creator:
 *   get:
 *     summary: Get all technicians created by logged-in user
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: List of technicians
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

router.delete('/tech/:id', authGuard, deleteTech);

/**
 * @swagger
 * /api/auth/reset-password-request:
 *   post:
 *     summary: Request a password reset email
 *     description: Sends a password reset link to the user's email if it exists.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: technician@example.com
 *     responses:
 *       200:
 *         description: Password reset email sent successfully.
 *       400:
 *         description: Invalid email address.
 *       404:
 *         description: Email not found.
 *     tags:
 *       - Authentication
 */
router.post('/reset-password-request', resetPasswordRequest);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset the password using a token
 *     description: Resets the password if the reset token is valid.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - newPassword
 *             properties:
 *               token:
 *                 type: string
 *                 description: Token received in email.
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 description: New password to set.
 *                 example: NewSecurePassword123
 *     responses:
 *       200:
 *         description: Password reset successfully.
 *       400:
 *         description: Invalid or expired token.
 *       404:
 *         description: Technician not found.
 *     tags:
 *       - Authentication
 */
router.post('/reset-password', resetPassword);




/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current logged-in technician
 *     description: Returns the details of the currently authenticated technician based on the provided token.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved technician data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 technician:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: Technician ID.
 *                     name:
 *                       type: string
 *                       description: Technician name.
 *                     email:
 *                       type: string
 *                       description: Technician email.
 *       401:
 *         description: Unauthorized. Token missing or invalid.
 *       404:
 *         description: Technician not found.
 *     tags:
 *       - Authentication
 */
router.get('/me',authGuard, getCurrentTechnician);

module.exports = router;
