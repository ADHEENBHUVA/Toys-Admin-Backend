const mongoose = require('mongoose');

const promoMediaSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['image', 'video']
    },
    title: {
        type: String,
        trim: true
    },
    subtitle: {
        type: String,
        trim: true
    },
    mediaUrl: {
        type: String,
        required: true
    },
    link: {
        type: String,
        trim: true
    },
    order: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('PromoMedia', promoMediaSchema);
