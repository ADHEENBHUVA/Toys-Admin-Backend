const mongoose = require('mongoose');

const returnSchema = new mongoose.Schema({
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    reason: { type: String, required: true },
    notes: { type: String },

    returnStatus: { type: String, enum: ['Requested', 'Approved', 'Rejected', 'Picked Up', 'Received', 'Refund Processing', 'Refunded'], default: 'Requested' },
    refundAmount: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('Return', returnSchema);
