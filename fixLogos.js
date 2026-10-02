const mongoose = require('mongoose');
const Brand = require('./models/Brand');
require('dotenv').config();

async function fixFailed() {
    await mongoose.connect(process.env.MONGO_URI);
    await Brand.updateOne({ name: 'Barbie' }, { $set: { logo: '/gallery/img6.jpg' } });
    await Brand.updateOne({ name: 'Nerf' }, { $set: { logo: '/gallery/img7.jpg' } });
    await Brand.updateOne({ name: 'Play-Doh' }, { $set: { logo: '/gallery/img8.jpg' } });
    console.log('Fixed 3 failed logos.');
    process.exit(0);
}
fixFailed();
