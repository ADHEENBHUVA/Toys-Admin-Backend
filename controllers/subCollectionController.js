const SubCollection = require('../models/SubCollection');

// Get all sub-categories (optional filter by parentCollection)
exports.getSubCollections = async (req, res) => {
    try {
        const { parentCollection } = req.query;
        let query = {};
        
        if (parentCollection) {
            query.parentCollection = parentCollection;
        }

        const subCollections = await SubCollection.find(query).sort({ displayOrder: 1, name: 1 }).populate('parentCollection', 'name');
        
        res.status(200).json({
            success: true,
            data: subCollections
        });
    } catch (error) {
        console.error('Error fetching sub-categories:', error);
        res.status(500).json({ success: false, message: 'Server error fetching sub-categories' });
    }
};

// Create a single sub-collection directly (if needed)
exports.createSubCollection = async (req, res) => {
    try {
        const subCollection = new SubCollection(req.body);
        const savedSubCollection = await subCollection.save();
        res.status(201).json({ success: true, data: savedSubCollection, message: 'Sub-collection created successfully' });
    } catch (error) {
        console.error('Error creating sub-collection:', error);
        res.status(500).json({ success: false, message: error.message || 'Error creating sub-collection' });
    }
};

// Update sub-collection
exports.updateSubCollection = async (req, res) => {
    try {
        const updated = await SubCollection.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ success: false, message: 'Sub-collection not found' });
        res.status(200).json({ success: true, data: updated, message: 'Sub-collection updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Error updating sub-collection' });
    }
};

// Delete sub-collection
exports.deleteSubCollection = async (req, res) => {
    try {
        const deleted = await SubCollection.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ success: false, message: 'Sub-collection not found' });
        res.status(200).json({ success: true, message: 'Sub-collection deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Error deleting sub-collection' });
    }
};
