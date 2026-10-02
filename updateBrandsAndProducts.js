const mongoose = require('mongoose');
const Product = require('./models/Product');
const Brand = require('./models/Brand');
const Category = require('./models/Category');
require('dotenv').config();

const brandsData = [
    { name: "LEGO", logo: "/gallery/img1.jpg" },
    { name: "Mattel", logo: "/gallery/img2.jpg" },
    { name: "Hasbro", logo: "/gallery/img3.jpg" },
    { name: "Fisher-Price", logo: "/gallery/img4.jpg" },
    { name: "Hot Wheels", logo: "/gallery/img5.jpg" },
    { name: "Barbie", logo: "/gallery/img6.jpg" },
    { name: "Nerf", logo: "/gallery/img7.jpg" },
    { name: "Play-Doh", logo: "/gallery/img8.jpg" },
    { name: "Melissa & Doug", logo: "/gallery/img9.jpg" },
    { name: "LeapFrog", logo: "/gallery/img10.jpg" }
];

const categoryNames = [
    "Action Figures",
    "Building Blocks",
    "Dolls & Accessories",
    "Educational Toys",
    "Board Games",
    "Outdoor Play",
    "Arts & Crafts",
    "Vehicles"
];

const descriptions = [
    "Unleash your child's imagination with this incredible toy! Perfect for developing fine motor skills and encouraging creative play. Made with non-toxic, child-safe materials, it promises endless hours of entertainment and learning.",
    "A must-have for any playtime collection! This beautifully designed product offers vibrant colors and engaging textures. It's built to withstand rigorous play while keeping your little one engaged and happy.",
    "Discover the joy of interactive learning! This toy is specifically designed to boost cognitive development and problem-solving skills. Whether playing solo or with friends, it's guaranteed to be a favorite.",
    "Bring the magic of playtime home! Featuring exceptional durability and a charming design, this toy is perfect for gifting. It helps children explore their surroundings and build confidence through active play.",
    "Ignite a passion for discovery! This fantastic toy combines fun and education seamlessly. With easy-to-handle pieces and a sturdy build, it's the perfect companion for your child's everyday adventures.",
    "Experience the ultimate in fun and creativity! This product is a fantastic way to encourage social interaction and teamwork. Crafted with care, it ensures a safe and delightful playtime experience.",
    "Get ready for non-stop action and excitement! This toy is designed to keep kids active and engaged. It’s lightweight, easy to use, and perfect for both indoor and outdoor fun.",
    "A timeless classic reinvented for today's kids! This toy promotes imaginative role-play and storytelling. It's incredibly durable and makes a wonderful addition to any playroom.",
    "Spark curiosity and wonder! This highly interactive toy is perfect for developing hand-eye coordination. Its bright colors and unique shape will instantly capture your child's attention.",
    "The perfect blend of fun, safety, and durability! This toy is designed to grow with your child, offering different ways to play as they develop. A fantastic investment in your child's early learning journey."
];

async function updateDatabase() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/toys_db');
        console.log("Connected to MongoDB Atlas.");

        // 1. Manage Brands
        await Brand.deleteMany({});
        console.log("Cleared existing brands.");
        
        const createdBrands = await Brand.insertMany(brandsData.map(b => ({
            name: b.name,
            logo: b.logo,
            description: `Official ${b.name} toys and accessories. Explore the best collections from ${b.name}.`,
            status: 'Active'
        })));
        console.log(`Created ${createdBrands.length} brands with LOGOS.`);

        // 2. Manage Categories
        let existingCategories = await Category.find({});
        for (const catName of categoryNames) {
            const exists = existingCategories.find(c => c.name === catName);
            if (!exists) {
                const newCat = await Category.create({ 
                    name: catName, 
                    description: `Explore our wide range of ${catName}`,
                    image: `https://ui-avatars.com/api/?name=${encodeURIComponent(catName)}&background=random&color=fff&size=512`
                });
                existingCategories.push(newCat);
            }
        }
        
        // Refresh categories list
        existingCategories = await Category.find({});
        console.log(`Ensured categories exist with images. Total categories: ${existingCategories.length}`);

        // 3. Update Products
        const products = await Product.find({});
        console.log(`Found ${products.length} products to update in MongoDB Atlas.`);

        for (let i = 0; i < products.length; i++) {
            const product = products[i];
            
            // Randomly select brand and category
            const randomBrand = createdBrands[Math.floor(Math.random() * createdBrands.length)];
            const randomCategory = existingCategories[Math.floor(Math.random() * existingCategories.length)];
            const randomDesc = descriptions[Math.floor(Math.random() * descriptions.length)];
            
            product.brand = randomBrand._id;
            product.category = randomCategory.name; // Keep as string or ID depending on schema
            
            // Generate a unique description by combining the product name with a template
            product.description = `<b>${product.name}</b><br/><br/>${randomDesc}<br/><i>Category: ${randomCategory.name} | Brand: ${randomBrand.name}</i>`;
            product.shortDescription = `High quality ${product.name} from ${randomBrand.name}.`;
            
            await product.save();
        }

        console.log("All products successfully updated with dynamic data, Logos, Categories, and Descriptions!");
        process.exit(0);
    } catch (error) {
        console.error("Error updating database:", error);
        process.exit(1);
    }
}

updateDatabase();
