const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    offerType: { type: String, enum: ['Product Discount', 'Category Discount', 'Brand Discount', 'Festival Offer', 'Flash Sale', 'Special Offer'], required: true },
    discountType: { type: String, enum: ['Percentage', 'Fixed Amount'], required: true },
    discountValue: { type: Number, required: true },

    eligibleProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    eligibleCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],

    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
}, { timestamps: true });

module.exports = mongoose.model('Offer', offerSchema);
