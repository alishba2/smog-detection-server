const express = require('express');
const router = express.Router();
const accessSettingController = require('../controllers/accessSettingController');
const authGuard = require('../middlewares/authGuard');

/**
 * @swagger
 * /api/access-setting:
 *   post:
 *     summary: Create or update access settings for a technician
 *     tags: [AccessSetting]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - technicianId
 *               - reports
 *             properties:
 *               technicianId:
 *                 type: string
 *                 example: "64f223b5ecb1c23f2a1b9d9c"
 *               reports:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Access setting saved successfully
 *       500:
 *         description: Server error
 */
router.post('/access-setting', authGuard, accessSettingController.setAccessSetting);

/**
 * @swagger
 * /api/access-setting:
 *   get:
 *     summary: Get access settings for a technician
 *     tags: [AccessSetting]
 *     responses:
 *       200:
 *         description: Technician access setting found
 *       404:
 *         description: Access setting not found
 *       500:
 *         description: Server error
 */
router.get('/access-setting', authGuard, accessSettingController.getAccessSetting);

/**
 * @swagger
 * /api/access-setting:
 *   delete:
 *     summary: Delete access settings for a technician
 *     tags: [AccessSetting]
 *     responses:
 *       200:
 *         description: Access setting deleted successfully
 *       404:
 *         description: Access setting not found
 *       500:
 *         description: Server error
 */
router.delete('/access-setting/:technicianId', authGuard, accessSettingController.deleteAccessSetting);

module.exports = router;
