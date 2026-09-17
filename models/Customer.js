const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    // Fields from Google Login / Customer Backend
    firebaseUid: { type: String, unique: true, sparse: true },
    name: { type: String },
    picture: { type: String },
    provider: { type: String, default: 'password' },
    role: { type: String, default: 'customer' },

    // Admin Fields
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    profileImage: { type: String },

    defaultAddress: {
        addressLine1: String,
        addressLine2: String,
        city: String,
        state: String,
        postalCode: String,
        country: String
    },

    totalOrders: { type: Number, default: 0 },
    totalSpending: { type: Number, default: 0 },

    accountStatus: { type: String, enum: ['Active', 'Inactive', 'Suspended'], default: 'Active' }
}, { timestamps: true });

// Explicitly bind this model to the 'users' collection so it shares data with Customer Backend
module.exports = mongoose.model('Customer', customerSchema, 'users');
