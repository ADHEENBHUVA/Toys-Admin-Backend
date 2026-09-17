const Coupon = require('../models/Coupon');

exports.getAllCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: coupons.length, data: coupons });
    } catch (error) {
        console.error('Error fetching coupons:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
exports.createCoupon = async (req, res) => {
    try {
        const newCoupon = await Coupon.create(req.body);
        res.status(201).json({ success: true, data: newCoupon });
    } catch (error) {
        console.error('Error creating coupon:', error);
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};
