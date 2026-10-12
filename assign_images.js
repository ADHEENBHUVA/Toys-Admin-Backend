const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
    const Category = require('./models/Category');
    const Collection = require('./models/Collection');
    const Product = require('./models/Product');

    console.log("Connected to DB");

    const categories = await Category.find({});
    for (const cat of categories) {
        // Find a product that belongs to this category
        const product = await Product.findOne({ categories: cat._id, 'images.0': { $exists: true } });
        if (product && product.images && product.images.length > 0) {
            cat.image = product.images[0];
            await cat.save();
            console.log(`Updated Category: ${cat.name} with product image`);
        } else {
            console.log(`No product image found for Category: ${cat.name}`);
        }
    }

    const collections = await Collection.find({});
    for (const col of collections) {
        const product = await Product.findOne({ collections: col._id, 'images.0': { $exists: true } });
        if (product && product.images && product.images.length > 0) {
            col.image = product.images[0];
            await col.save();
            console.log(`Updated Collection: ${col.name} with product image`);
        } else {
            console.log(`No product image found for Collection: ${col.name}`);
        }
    }

    console.log("Done");
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
