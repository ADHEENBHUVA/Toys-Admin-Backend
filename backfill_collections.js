const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('./models/Product');
const Category = require('./models/Category');
const SubCategory = require('./models/SubCategory');
const Collection = require('./models/Collection');
const SubCollection = require('./models/SubCollection');

async function run() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // 1. Create dummy Collections & SubCollections if they don't exist
    const collectionsData = ['Summer Collection', 'Winter Specials', 'Educational Bundles'];
    const createdCollections = [];
    for (const name of collectionsData) {
        let col = await Collection.findOne({ name });
        if (!col) col = await Collection.create({ name, description: 'Dummy Collection' });
        createdCollections.push(col);
    }

    const subCollectionsData = {
        'Summer Collection': ['Beach Toys', 'Water Guns'],
        'Winter Specials': ['Indoor Board Games', 'Puzzles'],
        'Educational Bundles': ['STEM Kits', 'Montessori']
    };

    const createdSubCollections = [];
    for (const col of createdCollections) {
        const subs = subCollectionsData[col.name];
        for (const sub of subs) {
            let sc = await SubCollection.findOne({ name: sub, parentCollection: col._id });
            if (!sc) sc = await SubCollection.create({ name: sub, parentCollection: col._id });
            createdSubCollections.push(sc);
        }
    }

    // 2. Fetch all products
    const products = await Product.find({});
    console.log(`Found ${products.length} products to update`);

    const allCategories = await Category.find({});
    const allSubCategories = await SubCategory.find({});

    let count = 0;
    for (const product of products) {
        // Link to existing string category if possible
        const matchedCategory = allCategories.find(c => c.name === product.category);
        if (matchedCategory && !product.categories?.includes(matchedCategory._id)) {
            product.categories = [matchedCategory._id];
        }

        if (product.subCategory && !product.subCategories?.includes(product.subCategory)) {
            product.subCategories = [product.subCategory];
        }

        // Assign random collections
        if (!product.collections || product.collections.length === 0) {
            const randomCol = createdCollections[Math.floor(Math.random() * createdCollections.length)];
            product.collections = [randomCol._id];
            
            // Assign random subcollection from that collection
            const validSubCols = createdSubCollections.filter(sc => sc.parentCollection.toString() === randomCol._id.toString());
            if (validSubCols.length > 0) {
                const randomSubCol = validSubCols[Math.floor(Math.random() * validSubCols.length)];
                product.subCollections = [randomSubCol._id];
            }
        }

        await product.save();
        count++;
    }

    console.log(`Successfully updated ${count} products with multiple categories/collections arrays.`);
    process.exit(0);
}

run().catch(console.error);
