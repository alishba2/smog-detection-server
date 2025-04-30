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
      return res.status(400).json({ error: 'Incorrect technician ID.' });
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

    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: 'Validation error. Please check the submitted data.', 
        details: error.errors 
      });
    }

    if (error.name === 'CastError') {
      return res.status(400).json({ 
        error: 'Invalid ID format. Please provide a valid technician ID.', 
        details: error.message 
      });
    }

    res.status(500).json({ 
      error: 'An unexpected error occurred while submitting the customer form. Please try again later.', 
      details: error.message 
    });
  }
}

module.exports = { submitCustomerForm };
