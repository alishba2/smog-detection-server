const express = require('express');
const router = express.Router();
const smogTestController = require('../controllers/smogTestController');

// POST - Create a new smog test
router.post('/create', smogTestController.createSmogTest);

// GET - Get smog test details by ID
router.get('/:id', smogTestController.getSmogTestById);

// PUT - Update smog test result (e.g., pass or fail)
router.put('/:id', smogTestController.updateSmogTestResult);

module.exports = router;
