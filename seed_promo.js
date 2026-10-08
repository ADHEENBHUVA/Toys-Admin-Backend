const mongoose = require('mongoose');
require('dotenv').config();
const PromoMedia = require('./models/PromoMedia');

const MONGO_URI = process.env.MONGO_URI || "mongodb://Vinit04:DGFSFM15xAbnOvjV@ac-69epuyt-shard-00-00.9vaob4b.mongodb.net:27017,ac-69epuyt-shard-00-01.9vaob4b.mongodb.net:27017,ac-69epuyt-shard-00-02.9vaob4b.mongodb.net:27017/adheen6?ssl=true&replicaSet=atlas-ikf2zx-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

// Public free stock videos for toys (using Pexels/Pixabay placeholders or generic MP4 links)
// Since direct MP4 links from stock video sites can break, using reliable sample videos
const videoUrl = "https://www.w3schools.com/html/mov_bbb.mp4"; // generic fallback if needed

const toyVideos = [
    {
        title: "Die-cast Porsche Carrera",
        subtitle: "Club: ₹1,424.00",
        type: "video",
        mediaUrl: "https://videos.pexels.com/video-files/5001479/5001479-uhd_2160_3840_30fps.mp4",
        link: "/products"
    },
    {
        title: "Frictions Airplanes",
        subtitle: "Club: ₹94.00",
        type: "video",
        mediaUrl: "https://videos.pexels.com/video-files/3889812/3889812-uhd_2160_4096_30fps.mp4",
        link: "/products"
    },
    {
        title: "Toy train with track set",
        subtitle: "Club: ₹993.00",
        type: "video",
        mediaUrl: "https://videos.pexels.com/video-files/3907572/3907572-hd_1080_1920_30fps.mp4",
        link: "/products"
    },
    {
        title: "Bafna Jumping Dino",
        subtitle: "Club: ₹94.00",
        type: "video",
        mediaUrl: "https://videos.pexels.com/video-files/3851574/3851574-hd_1080_1920_25fps.mp4",
        link: "/products"
    },
    {
        title: "Windup Fish Key Toy",
        subtitle: "Club: ₹94.00",
        type: "video",
        mediaUrl: "https://videos.pexels.com/video-files/4204558/4204558-hd_1080_1920_30fps.mp4",
        link: "/products"
    },
    {
        title: "Magic Spring Rainbow",
        subtitle: "Club: ₹45.00",
        type: "video",
        mediaUrl: "https://videos.pexels.com/video-files/3851581/3851581-hd_1080_1920_25fps.mp4",
        link: "/products"
    },
    {
        title: "Pull Back Mini Cars",
        subtitle: "Club: ₹150.00",
        type: "video",
        mediaUrl: "https://videos.pexels.com/video-files/4006198/4006198-hd_1080_1920_30fps.mp4",
        link: "/products"
    },
    {
        title: "Plush Teddy Bear",
        subtitle: "Club: ₹499.00",
        type: "video",
        mediaUrl: "https://videos.pexels.com/video-files/3851575/3851575-hd_1080_1920_25fps.mp4",
        link: "/products"
    },
    {
        title: "Building Blocks Set",
        subtitle: "Club: ₹899.00",
        type: "video",
        mediaUrl: "https://videos.pexels.com/video-files/4204555/4204555-hd_1080_1920_30fps.mp4",
        link: "/products"
    },
    {
        title: "Remote Control Truck",
        subtitle: "Club: ₹1,299.00",
        type: "video",
        mediaUrl: "https://videos.pexels.com/video-files/5001481/5001481-hd_1080_1920_30fps.mp4",
        link: "/products"
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to DB");
        
        // await PromoMedia.deleteMany({}); // Keep existing ones or clear? Let's just add new ones to be safe, or maybe clear to avoid duplicates? We won't clear.
        
        await PromoMedia.insertMany(toyVideos);
        console.log("Successfully inserted 10 toy videos into PromoMedia.");
        
        process.exit(0);
    } catch (err) {
        console.error("Error seeding DB:", err);
        process.exit(1);
    }
};

seedDB();
