const Service = require('../models/Service');

const defaultTests = [
  { name: 'MIL', result: 'Pending', comments: '' },
  { name: 'Catalyst Monitor', result: 'Pending', comments: '' },
  { name: 'Evap System', result: 'Pending', comments: '' },
  { name: 'Stored code', result: 'Pending', comments: '' }
];

exports.createService = async (technicianId, customerId) => {
  try {
    const testResults = [...defaultTests];

    const newService = new Service({
      technicianId,
      customerId,
      serviceDate: Date.now(),
      testResult: testResults
    });

    const savedService = await newService.save();

    const allTestsPassed = savedService.testResult.every(test => test.result === 'Pass');
    if (allTestsPassed) {
      savedService.passed = true;
      await savedService.save();
    }

    console.log("Created service successfully!");
    return { message: "Service created successfully!", service: savedService };
  } catch (error) {
    console.error('Error creating service:', error.message);
    throw new Error(`Failed to create service: ${error.message}`);
  }
};

exports.updateTestResult = async (req, res) => {
  try {
    const { serviceId, testId, result, comments } = req.body;

    const service = await Service.findById(serviceId);
    if (!service) return res.status(404).json({ message: 'Service not found.' });

    const test = service.testResult.id(testId);
    if (!test) return res.status(404).json({ message: 'Test not found.' });

    test.result = result || test.result;
    test.comments = comments || test.comments;
    test.testDate = new Date();

    await service.save();

    const allTestsPassed = service.testResult.every(test => test.result === 'Pass');
    if (allTestsPassed) {
      service.passed = true;
      await service.save();
    }

    res.status(200).json({ message: 'Test result updated successfully!', service });
  } catch (error) {
    console.error('Error updating test results:', error);
    res.status(500).json({ message: 'Error updating test results', error });
  }
};

exports.getServicesByTechnician = async (req, res) => {
  try {
    const services = await Service.find({ technicianId: req.params.techId }).populate('customerId');
    res.json(services);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching services', error: err.message });
  }
};

exports.getServicesByCustomer = async (req, res) => {
  try {
    const services = await Service.find({ customerId: req.params.customerId }).populate('technicianId');
    res.json(services);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching services', error: err.message });
  }
};
