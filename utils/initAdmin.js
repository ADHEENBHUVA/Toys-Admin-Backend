const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

const initAdmin = async () => {
    try {
        const adminEmail = 'adheenbhuva0007@gmail.com';
        const defaultPassword = 'Adheen@1712';

        const existingAdmin = await Admin.findOne({ email: adminEmail });
        if (!existingAdmin) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(defaultPassword, salt);

            await Admin.create({
                email: adminEmail,
                password: hashedPassword
            });
            console.log('Master Admin account created successfully.');
        }
    } catch (error) {
        console.error('Error initializing Master Admin:', error);
    }
};

module.exports = initAdmin;
