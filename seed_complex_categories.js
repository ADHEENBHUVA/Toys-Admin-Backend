const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('./models/Product');
const Category = require('./models/Category');
const SubCategory = require('./models/SubCategory');
const Collection = require('./models/Collection');
const SubCollection = require('./models/SubCollection');

const CATEGORY_DATA = {
    'Educational': ['STEM Kits', 'Puzzles', 'Flash Cards'],
    'Action Figures': ['Superheroes', 'Anime', 'Robots'],
    'Dolls & Accessories': ['Fashion Dolls', 'Dollhouses', 'Stuffed Dolls'],
    'Vehicles & RC': ['Cars', 'Helicopters', 'Trains'],
    'Building & Blocks': ['Lego Sets', 'Magnetic Blocks', 'Wooden Blocks'],
    'Art & Craft': ['Painting Sets', 'Clay & Dough', 'DIY Kits'],
    'Outdoor Play': ['Water Guns', 'Sports Equipment', 'Tents'],
    'Musical Instruments': ['Keyboards', 'Guitars', 'Drums'],
    'Soft Toys': ['Teddy Bears', 'Animals', 'Characters'],
    'Board Games': ['Family Games', 'Strategy Games', 'Card Games']
};

const COLLECTION_DATA = {
    'Summer Bonanza': ['Beach Essentials', 'Pool Party', 'Outdoor Fun'],
    'Winter Wonderland': ['Cozy Indoor', 'Holiday Gifts', 'Family Time']
};

function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

async function run() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        console.log('Clearing old categories and collections...');
        await Category.deleteMany({});
        await SubCategory.deleteMany({});
        await Collection.deleteMany({});
        await SubCollection.deleteMany({});

        // Create 10 Categories and their Subcategories
        console.log('Creating 10 Categories and Subcategories...');
        const createdCategories = [];
        const createdSubCategoriesMap = {};
        for (const [catName, subNames] of Object.entries(CATEGORY_DATA)) {
            const cat = await Category.create({ name: catName, description: catName + ' description' });
            createdCategories.push(cat);
            createdSubCategoriesMap[cat._id.toString()] = [];
            for (const subName of subNames) {
                const sub = await SubCategory.create({ name: subName, parentCategory: cat._id });
                createdSubCategoriesMap[cat._id.toString()].push(sub);
            }
        }

        // Create 2 Collections and their Subcollections
        console.log('Creating 2 Collections and Subcollections...');
        const createdCollections = [];
        const createdSubCollectionsMap = {};
        for (const [colName, subNames] of Object.entries(COLLECTION_DATA)) {
            const col = await Collection.create({ name: colName, description: colName + ' description' });
            createdCollections.push(col);
            createdSubCollectionsMap[col._id.toString()] = [];
            for (const subName of subNames) {
                const sub = await SubCollection.create({ name: subName, parentCollection: col._id });
                createdSubCollectionsMap[col._id.toString()].push(sub);
            }
        }

        // Fetch all products
        const products = await Product.find({});
        console.log(`Found ${products.length} products to update`);

        // We want an even distribution.
        // Shuffle products first.
        const shuffledProducts = shuffle([...products]);

        // Distribute categories evenly
        // If we have 50 products and 10 categories, each gets 5.
        // If we have 52 products, the first 2 get 6.
        let prodIndex = 0;
        for (let i = 0; i < shuffledProducts.length; i++) {
            const product = shuffledProducts[i];
            
            // Assign Category
            const cat = createdCategories[i % createdCategories.length];
            product.categories = [cat._id];
            
            // For legacy frontend support, also set string category
            product.category = cat.name;

            // Assign Subcategory
            const subs = createdSubCategoriesMap[cat._id.toString()];
            const randomSub = subs[Math.floor(Math.random() * subs.length)];
            product.subCategories = [randomSub._id];
            product.subCategory = randomSub._id;

            // Assign Collection (alternating between the 2)
            const col = createdCollections[i % createdCollections.length];
            product.collections = [col._id];

            // Assign Subcollection
            const colSubs = createdSubCollectionsMap[col._id.toString()];
            const randomColSub = colSubs[Math.floor(Math.random() * colSubs.length)];
            product.subCollections = [randomColSub._id];

            await Product.updateOne(
                { _id: product._id },
                { $set: {
                    categories: product.categories,
                    category: product.category,
                    subCategories: product.subCategories,
                    subCategory: product.subCategory,
                    collections: product.collections,
                    subCollections: product.subCollections
                }}
            );
        }

        console.log(`Successfully distributed 10 categories and 2 collections evenly across ${products.length} products.`);
        process.exit(0);

    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

run();
