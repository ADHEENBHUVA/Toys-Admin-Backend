const Brand = require('../models/Brand');

// Get all brands
exports.getBrands = async (req, res) => {
    try {
        const brands = await Brand.find().sort({ createdAt: -1 });
        res.status(200).json(brands);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Add new brand
exports.addBrand = async (req, res) => {
    try {
        const { name, logo, description, website, status } = req.body;
        if (!name) return res.status(400).json({ message: 'Brand name is required' });

        const brandExists = await Brand.findOne({ name });
        if (brandExists) return res.status(400).json({ message: 'Brand already exists' });

        const brand = await Brand.create({ name, logo, description, website, status });
        res.status(201).json(brand);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Update brand
exports.updateBrand = async (req, res) => {
    try {
        const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!brand) return res.status(404).json({ message: 'Brand not found' });
        res.status(200).json(brand);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Delete brand
exports.deleteBrand = async (req, res) => {
    try {
        const brand = await Brand.findByIdAndDelete(req.params.id);
        if (!brand) return res.status(404).json({ message: 'Brand not found' });
        res.status(200).json({ message: 'Brand deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
