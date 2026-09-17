const Review = require('../models/Review');

exports.getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate('product', 'name')
            .populate('customer', 'firstName lastName email')
            .sort({ createdAt: -1 });
            
        res.status(200).json({ success: true, count: reviews.length, data: reviews });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
