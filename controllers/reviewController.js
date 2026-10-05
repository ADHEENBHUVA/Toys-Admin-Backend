const Review = require('../models/Review');

exports.getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate('product', 'name')
            .populate('customer', 'firstName lastName name email')
            .sort({ createdAt: -1 });
            
        res.status(200).json({ success: true, count: reviews.length, data: reviews });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.updateReviewStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }
        
        const review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }
        
        review.status = status;
        await review.save();
        
        res.status(200).json({ success: true, data: review });
    } catch (error) {
        console.error('Error updating review status:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
