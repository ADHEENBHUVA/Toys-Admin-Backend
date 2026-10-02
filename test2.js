const mongoose = require('mongoose');
mongoose.connect('mongodb://Vinit04:DGFSFM15xAbnOvjV@ac-69epuyt-shard-00-00.9vaob4b.mongodb.net:27017,ac-69epuyt-shard-00-01.9vaob4b.mongodb.net:27017,ac-69epuyt-shard-00-02.9vaob4b.mongodb.net:27017/adheen6?ssl=true&replicaSet=atlas-ikf2zx-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0')
.then(async () => { 
    const Product = require('./models/Product'); 
    const counts = await Product.aggregate([{ $match: { status: 'Active' } }, { $group: { _id: '$category', count: { $sum: 1 } } }]); 
    console.log('Active Products per category:', counts); 
    const total = await Product.countDocuments({ status: 'Active' }); 
    console.log('Total Active Products:', total); 
    process.exit(0); 
}).catch(console.error);
