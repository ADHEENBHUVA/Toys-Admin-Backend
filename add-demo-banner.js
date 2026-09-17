const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

mongoose.connect('mongodb://Vinit04:DGFSFM15xAbnOvjV@ac-69epuyt-shard-00-00.9vaob4b.mongodb.net:27017,ac-69epuyt-shard-00-01.9vaob4b.mongodb.net:27017,ac-69epuyt-shard-00-02.9vaob4b.mongodb.net:27017/adheen6?ssl=true&replicaSet=atlas-ikf2zx-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0');
const Banner = mongoose.model('Banner', new mongoose.Schema({}, { strict: false }));

async function run() {
    // Read a real toy image from frontend public folder
    const imgPath = path.join(__dirname, '..', 'Customer Frontend', 'public', 'magical_toys_bg.jpg');
    let base64Image = '';
    
    if (fs.existsSync(imgPath)) {
        const fileData = fs.readFileSync(imgPath);
        base64Image = `data:image/jpeg;base64,${fileData.toString('base64')}`;
    } else {
        // Fallback placeholder if file not found
        base64Image = 'https://placehold.co/1200x400/FF9800/FFFFFF/png?text=Premium+Toys';
    }

    await Banner.create({
        title: "Welcome to Appifly Toys",
        image: base64Image,
        buttonLink: "/shop",
        displayOrder: 1,
        status: "Active",
        createdAt: new Date(),
        updatedAt: new Date()
    });
    
    console.log("Demo banner added successfully!");
    process.exit();
}
run();
