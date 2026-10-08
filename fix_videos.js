const mongoose = require('mongoose');
require('dotenv').config();
const PromoMedia = require('./models/PromoMedia');

const MONGO_URI = process.env.MONGO_URI || "mongodb://Vinit04:DGFSFM15xAbnOvjV@ac-69epuyt-shard-00-00.9vaob4b.mongodb.net:27017,ac-69epuyt-shard-00-01.9vaob4b.mongodb.net:27017,ac-69epuyt-shard-00-02.9vaob4b.mongodb.net:27017/adheen6?ssl=true&replicaSet=atlas-ikf2zx-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

const seedDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        
        // Pexels links often block direct hotlinking from localhosts, causing gray boxes.
        // We will update all video links to a reliable standard video file for testing.
        const reliableVideo = "https://www.w3schools.com/html/mov_bbb.mp4";
        
        await PromoMedia.updateMany(
            { type: 'video' },
            { $set: { mediaUrl: reliableVideo } }
        );
        
        console.log("Successfully updated video URLs to ensure they play properly.");
        process.exit(0);
    } catch (err) {
        console.error("Error updating DB:", err);
        process.exit(1);
    }
};

seedDB();
