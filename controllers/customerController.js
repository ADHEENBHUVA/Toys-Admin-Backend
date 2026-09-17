const Customer = require('../models/Customer');

exports.getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: customers.length, data: customers });
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.createCustomer = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, accountStatus } = req.body;
        
        if (!firstName || !lastName || !email) {
            return res.status(400).json({ success: false, message: 'Please provide first name, last name, and email' });
        }

        const existingCustomer = await Customer.findOne({ email });
        if (existingCustomer) {
            return res.status(400).json({ success: false, message: 'Customer with this email already exists' });
        }

        const customer = await Customer.create({
            firstName,
            lastName,
            email,
            phone,
            accountStatus: accountStatus || 'Active'
        });

        res.status(201).json({ success: true, data: customer });
    } catch (error) {
        console.error('Error creating customer:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.getCustomerById = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) {
            return res.status(404).json({ success: false, message: 'Customer not found' });
        }
        res.status(200).json({ success: true, data: customer });
    } catch (error) {
        console.error('Error fetching customer:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
