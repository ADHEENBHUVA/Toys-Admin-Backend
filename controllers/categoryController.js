const Category = require('../models/Category');
const Product = require('../models/Product'); // To count products per category
const SubCategory = require('../models/SubCategory');

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ displayOrder: 1, createdAt: -1 }).lean();
        
        // Add product counts to each category (simple approach for now)
        const enrichedCategories = await Promise.all(categories.map(async (cat) => {
            const count = await Product.countDocuments({ category: cat.name });
            const subCategories = await SubCategory.find({ parentCategory: cat._id }).sort({ displayOrder: 1, name: 1 }).lean();
            return { ...cat, productCount: count, subCategories };
        }));

        res.status(200).json({ success: true, count: enrichedCategories.length, data: enrichedCategories });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.createCategory = async (req, res) => {
    try {
        const { name, description, subCategories } = req.body;
        if (!name) {
            return res.status(400).json({ success: false, message: 'Please provide a category name' });
        }
        
        const category = await Category.create({ name, description });

        if (subCategories && Array.isArray(subCategories)) {
            const subCatDocs = subCategories.map(sc => ({
                name: typeof sc === 'string' ? sc : sc.name,
                parentCategory: category._id
            }));
            await SubCategory.insertMany(subCatDocs);
        }

        res.status(201).json({ success: true, data: category });
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const { name, description, status, subCategories } = req.body;
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            { name, description, status },
            { new: true, runValidators: true }
        );
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        if (subCategories && Array.isArray(subCategories)) {
            // Delete old subcategories not in the new list (or simply clear and recreate for simplicity)
            // But preserving IDs is better if products reference them. 
            // For simplicity, we can just add new ones that don't have an _id.
            
            for (const sc of subCategories) {
                if (typeof sc === 'string' || !sc._id) {
                    await SubCategory.create({ name: typeof sc === 'string' ? sc : sc.name, parentCategory: category._id });
                } else {
                    // Update existing
                    await SubCategory.findByIdAndUpdate(sc._id, { name: sc.name, status: sc.status || 'Active' });
                }
            }
        }

        res.status(200).json({ success: true, data: category });
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }
        await category.deleteOne();
        res.status(200).json({ success: true, message: 'Category deleted' });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
