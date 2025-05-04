const CustomerHistory = require('../models/CustomerHistory');

exports.createCustomerHistory = async (customerId, serviceId) => {
    try {
        const newHistory = new CustomerHistory({
            customerId,
            serviceId
        });

        const savedHistory = await newHistory.save();

        console.log('Customer history updated successfully!');
        return { message: 'Customer history updated successfully!', history: savedHistory };
    } catch (error) {
        console.error('Error updating customer history:', error.message);
        throw new Error(`Failed to update customer history: ${error.message}`);
    }
};
