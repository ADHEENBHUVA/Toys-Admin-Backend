const mongoose = require('mongoose');
mongoose.connect('mongodb://Vinit04:DGFSFM15xAbnOvjV@ac-69epuyt-shard-00-00.9vaob4b.mongodb.net:27017,ac-69epuyt-shard-00-01.9vaob4b.mongodb.net:27017,ac-69epuyt-shard-00-02.9vaob4b.mongodb.net:27017/adheen6?ssl=true&replicaSet=atlas-ikf2zx-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0');
const Banner = mongoose.model('Banner', new mongoose.Schema({}, { strict: false }));
async function run() {
    // Update second banner
    await Banner.updateOne(
        { _id: "6aaa8fed36db5ab53bb0ac27" },
        { $set: { image: "https://images.unsplash.com/photo-1558066898-7521098495a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80", title: "Fun Kids Toys" } }
    );
    console.log("Updated banner!");
    process.exit();
}
run();
