const SmogTest = require('../models/SmogTest');

// Create a new smog test
exports.createSmogTest = async (req, res) => {
  try {
    const { customerId, vehicleNumber, testDate, technicianId } = req.body;
    
    const newTest = new SmogTest({
      customerId,
      vehicleNumber,
      testDate,
      technicianId,
      status: 'pending' // Default status is pending
    });

    await newTest.save();

    res.status(201).json({ message: 'Smog test created successfully', test: newTest });
  } catch (err) {
    res.status(500).json({ message: 'Error creating smog test', error: err });
  }
};

// Get smog test details by ID
exports.getSmogTestById = async (req, res) => {
  try {
    const test = await SmogTest.findById(req.params.id);
    if (!test) {
      return res.status(404).json({ message: 'Smog test not found' });
    }

    res.json(test);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching smog test details', error: err });
  }
};

// Update smog test result (pass/fail)
exports.updateSmogTestResult = async (req, res) => {
  try {
    const { result, amount } = req.body; // Result can be 'pass' or 'fail'
    
    const test = await SmogTest.findByIdAndUpdate(req.params.id, { result, amount, status: 'completed' }, { new: true });

    if (!test) {
      return res.status(404).json({ message: 'Smog test not found' });
    }

    res.json({ message: 'Smog test result updated successfully', test });
  } catch (err) {
    res.status(500).json({ message: 'Error updating smog test result', error: err });
  }
};
