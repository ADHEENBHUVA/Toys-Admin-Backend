const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

async function updateRatings() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const products = await Product.find({});
        for (let p of products) {
            // Random rating between 3.5 and 5.0, rounded to 1 decimal
            const randomRating = (Math.random() * 1.5 + 3.5).toFixed(1);
            // Random count between 15 and 250
            const randomCount = Math.floor(Math.random() * 235) + 15;
            p.rating = parseFloat(randomRating);
            p.ratingCount = randomCount;
            await p.save();
        }
        console.log('Successfully updated product ratings and counts.');
        process.exit(0);
    } catch(e) {
        console.error(e);
        process.exit(1);
    }
}
updateRatings();
