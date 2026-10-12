const Collection = require('../models/Collection');
const Product = require('../models/Product'); // To count products per collection
const SubCollection = require('../models/SubCollection');

exports.getAllCollections = async (req, res) => {
    try {
        const collections = await Collection.find().sort({ displayOrder: 1, createdAt: -1 }).lean();
        
        // Add product counts to each collection (simple approach for now)
        const enrichedCollections = await Promise.all(collections.map(async (cat) => {
            const count = await Product.countDocuments({ 
                collections: cat._id 
            });
            const subCollections = await SubCollection.find({ parentCollection: cat._id }).sort({ displayOrder: 1, name: 1 }).lean();
            return { ...cat, productCount: count, subCollections };
        }));

        res.status(200).json({ success: true, count: enrichedCollections.length, data: enrichedCollections });
    } catch (error) {
        console.error('Error fetching collections:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.createCollection = async (req, res) => {
    try {
        const { name, description, subCollections } = req.body;
        let image = req.body.image;
        if (req.file) {
            image = `${process.env.VITE_API_URL || 'http://localhost:5000'}/uploads/${req.file.filename}`;
        }
        if (!name) {
            return res.status(400).json({ success: false, message: 'Please provide a collection name' });
        }
        
        const collection = await Collection.create({ name, description, image });

        let parsedSubCollections = subCollections;
        if (typeof subCollections === 'string') {
            try { parsedSubCollections = JSON.parse(subCollections); } catch (e) {}
        }
        if (parsedSubCollections && Array.isArray(parsedSubCollections)) {
            const subCatDocs = parsedSubCollections.map(sc => ({
                name: typeof sc === 'string' ? sc : sc.name,
                parentCollection: collection._id
            }));
            await SubCollection.insertMany(subCatDocs);
        }

        res.status(201).json({ success: true, data: collection });
    } catch (error) {
        console.error('Error creating collection:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.updateCollection = async (req, res) => {
    try {
        const { name, description, status, subCollections } = req.body;
        let image = req.body.image;
        if (req.file) {
            image = `${process.env.VITE_API_URL || 'http://localhost:5000'}/uploads/${req.file.filename}`;
        }
        
        // Parse subCollections back if it's sent as string
        let parsedSubCollections = subCollections;
        if (typeof subCollections === 'string') {
            try {
                parsedSubCollections = JSON.parse(subCollections);
            } catch (e) { }
        }
        const collection = await Collection.findByIdAndUpdate(
            req.params.id,
            { name, description, status, image },
            { new: true, runValidators: true }
        );
        if (!collection) {
            return res.status(404).json({ success: false, message: 'Collection not found' });
        }

        if (parsedSubCollections && Array.isArray(parsedSubCollections)) {
            // Delete old subcollections not in the new list (or simply clear and recreate for simplicity)
            // But preserving IDs is better if products reference them. 
            // For simplicity, we can just add new ones that don't have an _id.
            
            for (const sc of parsedSubCollections) {
                if (typeof sc === 'string' || !sc._id) {
                    await SubCollection.create({ name: typeof sc === 'string' ? sc : sc.name, parentCollection: collection._id });
                } else {
                    // Update existing
                    await SubCollection.findByIdAndUpdate(sc._id, { name: sc.name, status: sc.status || 'Active' });
                }
            }
        }

        res.status(200).json({ success: true, data: collection });
    } catch (error) {
        console.error('Error updating collection:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.deleteCollection = async (req, res) => {
    try {
        const collection = await Collection.findById(req.params.id);
        if (!collection) {
            return res.status(404).json({ success: false, message: 'Collection not found' });
        }
        await collection.deleteOne();
        res.status(200).json({ success: true, message: 'Collection deleted' });
    } catch (error) {
        console.error('Error deleting collection:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
