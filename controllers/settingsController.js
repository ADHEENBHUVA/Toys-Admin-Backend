const WebsiteSettings = require('../models/WebsiteSettings');

exports.getSettings = async (req, res) => {
    try {
        let settings = await WebsiteSettings.findOne();
        if (!settings) {
            settings = new WebsiteSettings();
            await settings.save();
        }
        res.json(settings);
    } catch (error) {
        console.error('Error fetching settings:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateSocialLinks = async (req, res) => {
    try {
        const { facebook, instagram, youtube, twitter } = req.body;
        let settings = await WebsiteSettings.findOne();
        if (!settings) {
            settings = new WebsiteSettings();
        }
        
        settings.socialLinks = {
            facebook: facebook || '',
            instagram: instagram || '',
            youtube: youtube || '',
            twitter: twitter || ''
        };
        
        await settings.save();
        res.json({ message: 'Social links updated successfully', settings });
    } catch (error) {
        console.error('Error updating social links:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateDiscountDisplayType = async (req, res) => {
    try {
        const { discountDisplayType } = req.body;
        if (!['amount', 'percentage'].includes(discountDisplayType)) {
            return res.status(400).json({ message: 'Invalid discount display type' });
        }
        
        let settings = await WebsiteSettings.findOne();
        if (!settings) {
            settings = new WebsiteSettings();
        }
        
        settings.discountDisplayType = discountDisplayType;
        await settings.save();
        
        res.json({ message: 'Discount display settings updated successfully', settings });
    } catch (error) {
        console.error('Error updating discount display type:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateFeaturedVideo = async (req, res) => {
    try {
        const { featuredVideoUrl, featuredVideoThumbnail } = req.body;
        let settings = await WebsiteSettings.findOne();
        if (!settings) {
            settings = new WebsiteSettings();
        }
        
        if (req.files && req.files.videoFile) {
            settings.featuredVideoUrl = `/uploads/settings/${req.files.videoFile[0].filename}`;
        } else if (featuredVideoUrl !== undefined) {
            settings.featuredVideoUrl = featuredVideoUrl;
        }

        if (req.files && req.files.thumbnailFile) {
            settings.featuredVideoThumbnail = `/uploads/settings/${req.files.thumbnailFile[0].filename}`;
        } else if (featuredVideoThumbnail !== undefined) {
            settings.featuredVideoThumbnail = featuredVideoThumbnail;
        }
        
        await settings.save();
        res.json({ message: 'Featured video updated successfully', settings });
    } catch (error) {
        console.error('Error updating featured video:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
