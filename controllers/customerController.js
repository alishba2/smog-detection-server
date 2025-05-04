const Customer = require('../models/Customer');
const mongoose = require('mongoose');
const Technician = require('../models/Technician');
const { createService } = require('./serviceController');
const Service = require('../models/Service');

async function submitCustomerForm(req, res) {
  const {
    name,
    email,
    phone,
    vehicleNumber,
    licensePlate,
    vehicleModel,
    vehicleMake,
    year,
    bill,
    signature,
    technicianId
  } = req.body;

  try {
    const technicianObjectId = new mongoose.Types.ObjectId(technicianId);

    // Check if technician exists
    const technician = await Technician.findById(technicianObjectId);
    if (!technician) {
      return res.status(400).json({ error: 'Incorrect technician ID.' });
    }

    // Check if customer exists by email + vehicleNumber
    let customer = await Customer.findOne({ email, vehicleNumber });

    if (customer) {
      // Existing customer → update details + mark as Returning
      customer.name = name;
      customer.phone = phone,
      customer.licensePlate = licensePlate;
      customer.vehicleModel = vehicleModel;
      customer.vehicleMake = vehicleMake;
      customer.year = year;
      customer.bill = bill;
      customer.signature = signature;
      customer.technicianId = technicianObjectId;
      customer.customerType = 'Returning Customer';
   

      await customer.save();
    } else {
      // New customer → create fresh + mark as New Customer
      customer = new Customer({
        name,
        email,
        phone,
        vehicleNumber,
        licensePlate,
        vehicleModel,
        vehicleMake,
        year,
        bill,
        signature,
        technicianId: technicianObjectId,
        customerType: 'New Customer'
      });

      await customer.save();
    }

    let {service}= await createService(technicianId, customer._id);

    res.status(201).json({
      message: customer.customerType === 'New Customer'
        ? 'New customer created and service logged!'
        : 'Existing customer updated and service logged!',
      customer,
      service
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

async function getCustomerHistory(customerId, technicianId) {

  console.log(customerId,technicianId);
  try {
    const services = await Service.find({
      technicianId,
      customerId,
      status: 'closed',
    })
      .exec();

    if (services.length === 0) {
      return { message: 'No closed services found for this customer and technician.' };
    }

    return services;
  } catch (error) {
    console.error('Error fetching customer history:', error.message);
    throw new Error(`Failed to fetch customer history: ${error.message}`);
  }
}
module.exports = { submitCustomerForm, getCustomerHistory };
