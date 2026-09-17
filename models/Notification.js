const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['New Order', 'Low Stock', 'Out of Stock', 'New Customer', 'New Review', 'Return Request', 'Refund Request', 'System'] },
    link: { type: String },
    read: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
