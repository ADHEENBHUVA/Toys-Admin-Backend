const mongoose = require('mongoose');
require('dotenv').config();
const PromoMedia = require('./models/PromoMedia');

const MONGO_URI = process.env.MONGO_URI || "mongodb://Vinit04:DGFSFM15xAbnOvjV@ac-69epuyt-shard-00-00.9vaob4b.mongodb.net:27017,ac-69epuyt-shard-00-01.9vaob4b.mongodb.net:27017,ac-69epuyt-shard-00-02.9vaob4b.mongodb.net:27017/adheen6?ssl=true&replicaSet=atlas-ikf2zx-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

const videoUrls = [
    "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    "https://www.w3schools.com/html/mov_bbb.mp4"
];

const updateDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        
        const mediaItems = await PromoMedia.find({ type: 'video' });
        
        for (let i = 0; i < mediaItems.length; i++) {
            const url = videoUrls[i % videoUrls.length];
            await PromoMedia.updateOne({ _id: mediaItems[i]._id }, { $set: { mediaUrl: url } });
        }
        
        console.log("Successfully updated video URLs to HTTPS.");
        process.exit(0);
    } catch (err) {
        console.error("Error updating DB:", err);
        process.exit(1);
    }
};

updateDB();
