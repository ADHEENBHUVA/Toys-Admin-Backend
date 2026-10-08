const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('Connected to MongoDB');
        const products = await Product.find({});
        
        let counts = { Boys: 0, Girls: 0, All: 0 };
        
        for (let i = 0; i < products.length; i++) {
            let assignedGender = 'All';
            if (i < 15) {
                assignedGender = 'Boys';
            } else if (i < 25) {
                assignedGender = 'Girls';
            }
            
            products[i].gender = assignedGender;
            await products[i].save();
            counts[assignedGender]++;
        }
        
        console.log(`Updated ${products.length} products successfully.`);
        console.log(`Distribution:`, counts);
        process.exit(0);
    })
    .catch(err => {
        console.error('Error connecting to MongoDB', err);
        process.exit(1);
    });
