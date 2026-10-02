const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

async function fixShortDesc() {
    await mongoose.connect(process.env.MONGO_URI);
    const products = await Product.find({});
    for (let p of products) {
        if (p.description) {
            // Description format is usually: <b>Name</b><br/><br/>Description Text<br/><i>...</i>
            // We want to extract the Description Text.
            let text = p.description;
            
            // Remove the bold title part if it exists
            const boldMatch = text.match(/<b>.*?<\/b><br\/>(?:<br\/>)?/);
            if (boldMatch) {
                text = text.replace(boldMatch[0], '');
            }
            
            // Remove the italic category/brand part
            const italicMatch = text.match(/<br\/>(?:<br\/>)?<i>.*?<\/i>/);
            if (italicMatch) {
                text = text.replace(italicMatch[0], '');
            }
            
            // Fallback: strip any remaining HTML
            text = text.replace(/<[^>]+>/g, '').trim();
            
            p.shortDescription = text;
            await p.save();
        }
    }
    console.log('Fixed shortDescription for all products.');
    process.exit(0);
}
fixShortDesc();
