const Testimonial = require('../models/Testimonial');

// Get all testimonials
exports.getTestimonials = async (req, res) => {
    try {
        const testimonials = await Testimonial.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: testimonials });
    } catch (error) {
        console.error('Error fetching testimonials:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Add new testimonial
exports.addTestimonial = async (req, res) => {
    try {
        const { name, location, text, rating, avatar, isActive } = req.body;
        
        if (!name || !location || !text || !avatar) {
            return res.status(400).json({ success: false, message: 'Please provide all required fields' });
        }

        const testimonial = await Testimonial.create({
            name,
            location,
            text,
            rating: rating || 5,
            avatar,
            isActive: isActive !== undefined ? isActive : true
        });

        res.status(201).json({ success: true, data: testimonial });
    } catch (error) {
        console.error('Error adding testimonial:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Update testimonial
exports.updateTestimonial = async (req, res) => {
    try {
        const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!testimonial) {
            return res.status(404).json({ success: false, message: 'Testimonial not found' });
        }

        res.status(200).json({ success: true, data: testimonial });
    } catch (error) {
        console.error('Error updating testimonial:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Delete testimonial
exports.deleteTestimonial = async (req, res) => {
    try {
        const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
        
        if (!testimonial) {
            return res.status(404).json({ success: false, message: 'Testimonial not found' });
        }

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        console.error('Error deleting testimonial:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
