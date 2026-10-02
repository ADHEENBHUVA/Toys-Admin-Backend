const mongoose = require('mongoose');
const Brand = require('./models/Brand');
const fs = require('fs');
const https = require('https');
require('dotenv').config();

const brandsData = [
    { name: "LEGO", domain: "lego.com" },
    { name: "Mattel", domain: "mattel.com" },
    { name: "Hasbro", domain: "hasbro.com" },
    { name: "Fisher-Price", domain: "fisher-price.com" },
    { name: "Hot Wheels", domain: "hotwheels.com" },
    { name: "Barbie", domain: "barbie.com" },
    { name: "Nerf", domain: "nerf.hasbro.com" },
    { name: "Play-Doh", domain: "playdoh.hasbro.com" },
    { name: "Melissa & Doug", domain: "melissaanddoug.com" },
    { name: "LeapFrog", domain: "leapfrog.com" }
];

function fetchBase64(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                // Follow redirect
                return resolve(fetchBase64(res.headers.location));
            }
            if (res.statusCode !== 200) {
                console.log(`Failed to fetch ${url} - Status: ${res.statusCode}`);
                return resolve(null); // Return null on failure
            }

            const data = [];
            res.on('data', chunk => data.push(chunk));
            res.on('end', () => {
                const buffer = Buffer.concat(data);
                const contentType = res.headers['content-type'] || 'image/png';
                const base64 = `data:${contentType};base64,${buffer.toString('base64')}`;
                resolve(base64);
            });
        }).on('error', err => resolve(null));
    });
}

async function updateDatabase() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/toys_db');
        console.log("Connected to MongoDB Atlas.");

        for (const b of brandsData) {
            console.log(`Fetching logo for ${b.name}...`);
            let base64Logo = await fetchBase64(`https://logo.clearbit.com/${b.domain}`);
            
            // If clearbit fails, fallback to a google favicon
            if (!base64Logo) {
                console.log(`Clearbit failed, trying Google Favicon for ${b.name}...`);
                base64Logo = await fetchBase64(`https://www.google.com/s2/favicons?domain=${b.domain}&sz=256`);
            }

            if (base64Logo) {
                const updated = await Brand.findOneAndUpdate(
                    { name: b.name },
                    { $set: { logo: base64Logo } },
                    { new: true }
                );
                if (updated) {
                    console.log(`Successfully updated ${b.name} with real logo!`);
                } else {
                    console.log(`Brand ${b.name} not found in DB!`);
                }
            } else {
                console.log(`Could not fetch ANY logo for ${b.name}`);
            }
        }

        console.log("Finished updating brand logos.");
        process.exit(0);
    } catch (error) {
        console.error("Error updating database:", error);
        process.exit(1);
    }
}

updateDatabase();
