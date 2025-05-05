const Service = require('../models/Service');
const Customer = require('../models/Customer');
const Report = require('../models/Report');

const defaultTests = [
  { name: 'MIL', result: 'Pending', comments: '' },
  { name: 'Catalyst Monitor', result: 'Pending', comments: '' },
  { name: 'Evap System', result: 'Pending', comments: '' },
  { name: 'Stored code', result: 'Pending', comments: '' }
];


exports.createService = async (technicianId, customerId) => {
  try {
    // Get the current count of Service documents


    const serviceCount = await Service.countDocuments();

    // Generate the jobId in the format #SMG_CUSTOMERNUMBER
    const jobId = `#SMG_${serviceCount + 1}`;

    const newService = new Service({
      jobId,
      technicianId,
      customerId,
      serviceDate: Date.now()
    });

    const savedService = await newService.save();

    console.log("Created service successfully!");
    return { message: "Service created successfully!", service: savedService };
  } catch (error) {
    console.error('Error creating service:', error.message);
    throw new Error(`Failed to create service: ${error.message}`);
  }
};

exports.updateTestResult = async (req, res) => {
  try {
    const { serviceId, result } = req.body;

    console.log(serviceId, result, "serviceId, result");

    // Find the service by ID
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found.' });
    }

    // Find the customer by ID
    const customer = await Customer.findById(service.customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found.' });
    }

    const technicianId = customer.technicianId;

    // Update the test result
    service.passed = result === 'pass'; // true if 'pass'
    service.status = 'closed';

    // Update customer visit info
    customer.totalNumberOfVisits = (customer.totalNumberOfVisits || 0) + 1;
    customer.lastVisitAt = new Date();

    // Save service and customer
    await service.save();
    await customer.save();

    // -----------------------------
    // Update technician report
    // -----------------------------
    const today = new Date();
    today.setHours(0, 0, 0, 0); // set time to 00:00 for today

    // Find all services for the technician with status 'closed'
    const allServices = await Service.find({
      technicianId,
      status: 'closed'
    }).populate('customerId');  // Populate the customerId to get the bill data

    // Initialize variables to accumulate total revenue and job counts
    let totalRevenue = 0;
    let totalJobs = 0;
    let todayRevenue = 0;
    let todayJobs = 0;

    // Loop through all services to accumulate the values
    allServices.forEach(service => {
      // Add to total revenue and jobs
      totalRevenue += service.customerId.bill?.serviceFee || 0;
      totalJobs++;
      console.log(totalRevenue);

      // Check if the service was done today and add to today's revenue and jobs
      const serviceDate = new Date(service.createdAt);
      if (serviceDate >= today) {
        todayRevenue += service.customerId.bill?.serviceFee || 0;
        todayJobs++;
      }
    });

    console.log(todayJobs,"today jobs");
    // Check if a report exists for today
    let report = await Report.findOne({
      technicianId
    });

    console.log(report, "report here");
    if (report) {
      // Update the existing report
      report.totalRevenue = totalRevenue;
      report.totalJobs = totalJobs;
      report.todayJobs = todayJobs;
      report.todayRevenue = todayRevenue;
      await report.save();
    } else {
      // Create a new report if it doesn't exist
      report = new Report({
        technicianId,
        totalRevenue,
        totalJobs,
        todayJobs,
        todayRevenue,
        date: new Date()  // today's date
      });
      await report.save();
    }

    res.status(200).json({
      message: 'Test result updated, service closed, and report updated!',
      service,
      customer,
      report
    });

  } catch (error) {
    console.error('Error updating test results:', error);
    res.status(500).json({ message: 'Error updating test results', error: error.message });
  }
};



exports.getServicesByTechnician = async (req, res) => {
  try {
    const services = await Service.find({ technicianId: req.params.techId }).populate('customerId');
    console.log(services);
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

exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.serviceId).populate('technicianId').populate('customerId');
    if (!service) return res.status(404).json({ message: 'Service not found.' });

    res.status(200).json(service);
  } catch (error) {
    console.error('Error fetching service by ID:', error.message);
    res.status(500).json({ message: 'Error fetching service', error: error.message });
  }
};


exports.getRevenueAndJobsForDate = async (req, res) => {
  try {
    const { technicianId, startDate, endDate } = req.query;

    console.log("Start Date:", startDate, "End Date:", endDate);

    // Parse start and end dates
    const start = new Date(startDate);
    start.setUTCHours(0, 0, 0, 0);  // Set start to midnight (00:00:00) of the start day

    const end = new Date(endDate);
    end.setUTCHours(23, 59, 59, 999);  // Set end to the last millisecond of the end day

    console.log("Parsed Start:", start, "Parsed End:", end);

    // Query all services in the range
    const allServices = await Service.find({
      technicianId,
      status: 'closed',
      createdAt: { $gte: start, $lte: end }  // This should correctly include the entire range
    }).populate('customerId');

    console.log("All Services Found:", allServices);

    let totalRevenue = 0;
    let totalJobs = 0;

    // Loop through all services to calculate revenue and job counts
    allServices.forEach(service => {
      console.log("Service:", service);

      // Check if the service's createdAt is within the given range
      const serviceCreatedAt = new Date(service.createdAt);
      console.log("Service Created At:", serviceCreatedAt);

      // Ensure that customerId.bill exists and is populated
      totalRevenue += service.customerId.bill?.serviceFee || 0;
      totalJobs++;
    });

    console.log("Total Revenue:", totalRevenue);
    console.log("Total Jobs:", totalJobs);

    // Return the results
    res.status(200).json({
      message: 'Revenue and jobs for the date range fetched successfully!',
      totalRevenue,
      totalJobs
    });
  } catch (error) {
    console.error('Error fetching revenue and jobs for the date range:', error);
    res.status(500).json({ message: 'Error fetching revenue and jobs for the date range', error: error.message });
  }
};
