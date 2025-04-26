const Customer = require('../models/Customer'); // Import the Customer model
const mongoose = require('mongoose');
const Technician = require('../models/Technician'); // Assuming you have this model
const { createService } = require('./serviceController');

async function submitCustomerForm(req, res) {
  const {
    name,
    email,
    vehicleNumber,
    licensePlate,
    vehicleModel,
    vehicleMake,
    year,
    service,
    bill,
    signature,
    technicianId
  } = req.body;

  try {
    // Convert technicianId to ObjectId
    const technicianObjectId = new mongoose.Types.ObjectId(technicianId);

    // Check if technician exists
    const technician = await Technician.findById(technicianObjectId);
    if (!technician) {
      return res.status(400).json({ message: 'Technician not found' });
    }

    const newCustomer = new Customer({
      name,
      email,
      vehicleNumber,
      licensePlate,
      vehicleModel,
      vehicleMake,
      year,
      service,
      bill,
      signature,
      technicianId: technicianObjectId 
    });

    let customer = await newCustomer.save();
    await createService(technicianId, customer?._id);
    res.status(201).json({
      message: 'Customer form submitted successfully!',
      customer: newCustomer
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error while submitting customer form' });
  }
}

module.exports = { submitCustomerForm };


module.exports = {
  submitCustomerForm
};
