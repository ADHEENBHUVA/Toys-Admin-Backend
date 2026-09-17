const Banner = require('../models/Banner');

// Get all banners
const getBanners = async (req, res) => {
    try {
        const banners = await Banner.find().sort({ displayOrder: 1, createdAt: -1 });
        res.json(banners);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching banners', error: error.message });
    }
};

// Get active banners only
const getActiveBanners = async (req, res) => {
    try {
        const banners = await Banner.find({ status: 'Active' }).sort({ displayOrder: 1 });
        res.json(banners);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching active banners', error: error.message });
    }
};

// Create a new banner
const createBanner = async (req, res) => {
    try {
        // Enforce max 20 banners
        const count = await Banner.countDocuments();
        if (count >= 20) {
            return res.status(400).json({ message: 'Maximum limit of 20 banners reached. Please delete an existing banner to add a new one.' });
        }

        const banner = new Banner(req.body);
        const savedBanner = await banner.save();
        res.status(201).json(savedBanner);
    } catch (error) {
        res.status(400).json({ message: 'Error creating banner', error: error.message });
    }
};

// Update a banner
const updateBanner = async (req, res) => {
    try {
        const { id } = req.params;
        const banner = await Banner.findByIdAndUpdate(id, req.body, { new: true });
        
        if (!banner) {
            return res.status(404).json({ message: 'Banner not found' });
        }
        res.json(banner);
    } catch (error) {
        res.status(400).json({ message: 'Error updating banner', error: error.message });
    }
};

// Delete a banner
const deleteBanner = async (req, res) => {
    try {
        const { id } = req.params;
        const banner = await Banner.findByIdAndDelete(id);
        
        if (!banner) {
            return res.status(404).json({ message: 'Banner not found' });
        }
        res.json({ message: 'Banner deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting banner', error: error.message });
    }
};

module.exports = {
    getBanners,
    getActiveBanners,
    createBanner,
    updateBanner,
    deleteBanner
};
