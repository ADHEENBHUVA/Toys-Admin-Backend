const SubCategory = require('../models/SubCategory');

// Get all sub-categories (optional filter by parentCategory)
exports.getSubCategories = async (req, res) => {
    try {
        const { parentCategory } = req.query;
        let query = {};
        
        if (parentCategory) {
            query.parentCategory = parentCategory;
        }

        const subCategories = await SubCategory.find(query).sort({ displayOrder: 1, name: 1 }).populate('parentCategory', 'name');
        
        res.status(200).json({
            success: true,
            data: subCategories
        });
    } catch (error) {
        console.error('Error fetching sub-categories:', error);
        res.status(500).json({ success: false, message: 'Server error fetching sub-categories' });
    }
};

// Create a single sub-category directly (if needed)
exports.createSubCategory = async (req, res) => {
    try {
        const subCategory = new SubCategory(req.body);
        const savedSubCategory = await subCategory.save();
        res.status(201).json({ success: true, data: savedSubCategory, message: 'Sub-category created successfully' });
    } catch (error) {
        console.error('Error creating sub-category:', error);
        res.status(500).json({ success: false, message: error.message || 'Error creating sub-category' });
    }
};

// Update sub-category
exports.updateSubCategory = async (req, res) => {
    try {
        const updated = await SubCategory.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ success: false, message: 'Sub-category not found' });
        res.status(200).json({ success: true, data: updated, message: 'Sub-category updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Error updating sub-category' });
    }
};

// Delete sub-category
exports.deleteSubCategory = async (req, res) => {
    try {
        const deleted = await SubCategory.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ success: false, message: 'Sub-category not found' });
        res.status(200).json({ success: true, message: 'Sub-category deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Error deleting sub-category' });
    }
};
