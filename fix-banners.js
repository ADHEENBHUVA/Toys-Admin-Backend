const mongoose = require('mongoose');
mongoose.connect('mongodb://Vinit04:DGFSFM15xAbnOvjV@ac-69epuyt-shard-00-00.9vaob4b.mongodb.net:27017,ac-69epuyt-shard-00-01.9vaob4b.mongodb.net:27017,ac-69epuyt-shard-00-02.9vaob4b.mongodb.net:27017/adheen6?ssl=true&replicaSet=atlas-ikf2zx-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0');
const Banner = mongoose.model('Banner', new mongoose.Schema({}, { strict: false }));
async function run() {
    // Update first banner
    await Banner.updateOne(
        { _id: "6a9ff97489854fdae285779a" },
        { $set: { image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80", title: "Premium Toys" } }
    );
    // Update second banner
    await Banner.updateOne(
        { _id: "6aa0d84f0a3a58d6db3d3817" },
        { $set: { image: "https://images.unsplash.com/photo-1566576722002-b8684288679e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80", title: "New Arrivals" } }
    );
    console.log("Updated banners!");
    process.exit();
}
run();
