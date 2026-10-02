const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

async function resetRatings() {
    await mongoose.connect(process.env.MONGO_URI);
    await Product.updateMany({}, { $set: { rating: 0, ratingCount: 0 } });
    console.log('Reset all ratings to 0.');
    process.exit(0);
}
resetRatings();
