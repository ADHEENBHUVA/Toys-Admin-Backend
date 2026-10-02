const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const adjectives = ["Amazing", "Colorful", "Educational", "Interactive", "Wooden", "Plush", "Musical", "Creative", "Magnetic", "Classic", "Electronic", "Soft", "Giant", "Mini", "Premium"];
const nouns = ["Puzzle", "Building Blocks", "Train Set", "Doll", "Action Figure", "Board Game", "Teddy Bear", "Car Track", "Robot", "Kitchen Set", "Science Kit", "Art Set", "Rattle", "Play Tent", "Xylophone"];

// Array of local toy images from public/gallery
const toyImages = Array.from({ length: 20 }, (_, i) => `/gallery/img${i + 1}.jpg`);

function getRandomElements(arr, num) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
}

function generateRandomName(index) {
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    return `${adj} ${noun} Deluxe Edition ${index + 1}`;
}

async function updateProducts() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/toys_db');
        console.log("Connected to MongoDB.");

        const products = await Product.find({});
        console.log(`Found ${products.length} products to update.`);

        for (let i = 0; i < products.length; i++) {
            const product = products[i];
            
            // Randomize name and descriptions
            product.name = generateRandomName(i);
            product.description = `Experience endless fun and learning with the ${product.name}. This carefully crafted product is designed to bring joy and enhance developmental skills. Made with premium, child-safe materials, it's perfect for both solo play and sharing with friends.`;
            product.shortDescription = `High quality ${product.name} for hours of fun.`;

            // Randomize prices
            const basePrice = Math.floor(Math.random() * 2000) + 500; // Between 500 and 2500
            product.price = basePrice;
            
            // 30% chance to have a discount (compareAtPrice > price)
            if (Math.random() > 0.7) {
                product.compareAtPrice = basePrice + Math.floor(Math.random() * 500) + 200;
            } else {
                product.compareAtPrice = null;
            }

            // Assign exactly 5 images
            const selectedImages = getRandomElements(toyImages, 5);
            product.images = selectedImages;
            product.thumbnailImage = selectedImages[0];

            // Some have low stock (<= 5)
            if (product.status === 'Active') {
                if (Math.random() > 0.8) {
                    product.stockQuantity = Math.floor(Math.random() * 5) + 1; // 1 to 5
                } else {
                    product.stockQuantity = Math.floor(Math.random() * 50) + 10;
                }
            }

            await product.save();
        }

        console.log("All products successfully updated with unique data and 5 images each!");
        process.exit(0);
    } catch (error) {
        console.error("Error updating products:", error);
        process.exit(1);
    }
}

updateProducts();
