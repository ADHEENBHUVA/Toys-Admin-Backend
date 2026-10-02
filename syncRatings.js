const mongoose = require('mongoose');
const Product = require('./models/Product');
const Review = require('./models/Review');
require('dotenv').config();

async function syncRatings() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        const products = await Product.find({});
        for (let p of products) {
            const approvedReviews = await Review.find({ product: p._id, status: 'Approved' });
            
            if (approvedReviews.length === 0) {
                p.rating = 0;
                p.ratingCount = 0;
            } else {
                const sum = approvedReviews.reduce((acc, rev) => acc + rev.rating, 0);
                p.rating = parseFloat((sum / approvedReviews.length).toFixed(1));
                p.ratingCount = approvedReviews.length;
            }
            
            await p.save();
        }
        
        console.log('Successfully synced all product ratings based on actual approved reviews.');
        process.exit(0);
    } catch(e) {
        console.error(e);
        process.exit(1);
    }
}
syncRatings();
