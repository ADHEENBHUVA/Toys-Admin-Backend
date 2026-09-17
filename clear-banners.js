const mongoose = require('mongoose');
mongoose.connect('mongodb://Vinit04:DGFSFM15xAbnOvjV@ac-69epuyt-shard-00-00.9vaob4b.mongodb.net:27017,ac-69epuyt-shard-00-01.9vaob4b.mongodb.net:27017,ac-69epuyt-shard-00-02.9vaob4b.mongodb.net:27017/adheen6?ssl=true&replicaSet=atlas-ikf2zx-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0');
const Banner = mongoose.model('Banner', new mongoose.Schema({}, { strict: false }));
async function run() {
    await Banner.deleteMany({});
    console.log("All banners deleted successfully!");
    process.exit();
}
run();
