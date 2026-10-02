const mongoose = require('mongoose');
mongoose.connect('mongodb://Vinit04:DGFSFM15xAbnOvjV@ac-69epuyt-shard-00-00.9vaob4b.mongodb.net:27017,ac-69epuyt-shard-00-01.9vaob4b.mongodb.net:27017,ac-69epuyt-shard-00-02.9vaob4b.mongodb.net:27017/adheen6?ssl=true&replicaSet=atlas-ikf2zx-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0')
.then(async () => { 
    const Product = require('./models/Product'); 
    const inactive = await Product.find({ status: { $ne: 'Active' } }, 'name status stockQuantity').lean(); 
    console.log('Inactive Products:', inactive); 
    process.exit(0); 
}).catch(console.error);
