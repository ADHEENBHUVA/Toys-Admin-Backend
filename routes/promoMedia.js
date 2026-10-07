const express = require('express');
const router = express.Router();
const PromoMedia = require('../models/PromoMedia');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'uploads/promo';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'promo-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max for videos
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
            cb(null, true);
        } else {
            cb(new Error('Only images and videos are allowed!'));
        }
    }
});

// GET all promo media
router.get('/', async (req, res) => {
    try {
        const media = await PromoMedia.find().sort({ order: 1, createdAt: -1 });
        res.json(media);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a new promo media
router.post('/', upload.single('mediaFile'), async (req, res) => {
    try {
        const { type, title, subtitle, link, order, isActive, existingMediaUrl } = req.body;
        
        let mediaUrl = existingMediaUrl;
        if (req.file) {
            mediaUrl = `/uploads/promo/${req.file.filename}`;
        }
        
        if (!mediaUrl) {
            return res.status(400).json({ message: 'Media file or URL is required' });
        }

        const promoMedia = new PromoMedia({
            type,
            title,
            subtitle,
            mediaUrl,
            link,
            order: order || 0,
            isActive: isActive !== undefined ? isActive : true
        });

        const newMedia = await promoMedia.save();
        res.status(201).json(newMedia);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT (update) promo media
router.put('/:id', upload.single('mediaFile'), async (req, res) => {
    try {
        const { type, title, subtitle, link, order, isActive, existingMediaUrl } = req.body;
        
        let mediaUrl = existingMediaUrl;
        if (req.file) {
            mediaUrl = `/uploads/promo/${req.file.filename}`;
        }

        const mediaToUpdate = await PromoMedia.findById(req.params.id);
        if (!mediaToUpdate) {
            return res.status(404).json({ message: 'Promo Media not found' });
        }
        
        // Update fields
        if (type) mediaToUpdate.type = type;
        if (title !== undefined) mediaToUpdate.title = title;
        if (subtitle !== undefined) mediaToUpdate.subtitle = subtitle;
        if (link !== undefined) mediaToUpdate.link = link;
        if (order !== undefined) mediaToUpdate.order = order;
        if (isActive !== undefined) mediaToUpdate.isActive = isActive;
        if (mediaUrl) mediaToUpdate.mediaUrl = mediaUrl;

        const updatedMedia = await mediaToUpdate.save();
        res.json(updatedMedia);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE promo media
router.delete('/:id', async (req, res) => {
    try {
        const media = await PromoMedia.findById(req.params.id);
        if (!media) {
            return res.status(404).json({ message: 'Promo Media not found' });
        }
        await media.deleteOne();
        res.json({ message: 'Promo Media deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
