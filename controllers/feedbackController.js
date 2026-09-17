const ContactEnquiry = require('../models/ContactEnquiry');

exports.getAllFeedbacks = async (req, res) => {
    try {
        const feedbacks = await ContactEnquiry.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: feedbacks.length, data: feedbacks });
    } catch (error) {
        console.error('Error fetching feedbacks:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
